const keystone = require('keystone')

const BlockchainTransactionRepository = keystone.list('BlockchainTransaction').model

class TransactionProcessor {
  constructor (applicationContext) {
    this.applicationContext = applicationContext
  }

  get blockChainExplorer () {
    return this.applicationContext.blockChainExplorer
  }

  get transactionParser () {
    return this.applicationContext.transactionParser
  }

  get notificationService () {
    return this.applicationContext.notificationService
  }

  /**
  * Обработка rawTx.
  * Сохранить транзакцию как unconfirmed а затем оповестить все адреса,
  * участвующие в транзакции о предстоящих изменениях баланса
  */
  async processTransaction (rawtx) {
    let txInfo = await this.transactionParser.parseRawTx(rawtx)

    await this.blockChainExplorer.sendTx(rawtx)

    const tx = await new BlockchainTransactionRepository({
      rawtx: txInfo.rawtx,
      txId: txInfo.txId,
      status: 'UNCONFIRMED',
      inputAddresses: txInfo.inputAddressChanges.map(e => e.address),
      outputAddresses: txInfo.outputAddressChanges.map(e => e.address)
    }).save()

    this.notifyAddressesAboutBalance({
      addresses: [...new Set(tx.inputAddresses.concat(tx.outputAddresses))]
    })
  }

  /**
  * Оповестить транзакции с txId in txIds об изменении confirmedBalance.
  * Пометить все транзакции confirmed (если они есть в БД).
  */
  async confirmTransactions (txIds) {
    let confirmedTransactions = await BlockchainTransactionRepository.find()
      .where('txId')
      .in(txIds)
      .exec()

    confirmedTransactions = await Promise.all(
      confirmedTransactions.map(tx => {
        tx.status = 'MINED'
        return tx.save()
      })
    )

    let participantAddresses = []
    for (let tx of confirmedTransactions) {
      participantAddresses = participantAddresses.concat(tx.inputAddresses).concat(tx.outputAddresses)
    }

    // Обработка транзакций, которых нет в БД, но они пришли в блоке
    const confirmedTransactionIds = confirmedTransactions.map(e => e.txId)
    const unknownTransactionIds = txIds.filter(e => !confirmedTransactionIds.includes(e))

    for (let txId of unknownTransactionIds) {
      try {
        const rawTx = await this.blockChainExplorer.getRawTx(txId)
        const txInfo = await this.transactionParser.parseRawTx(rawTx)
        const inputAddresses = txInfo.inputAddressChanges.map(e => e.address)
        const outputAddresses = txInfo.outputAddressChanges.map(e => e.address)

        participantAddresses = participantAddresses.concat(inputAddresses).concat(outputAddresses)
      } catch (e) {
        console.error(`TransactionProcessor.confirmTransactions: something wrong with tx with txId = [${txId}]`)
      }
    }

    this.notifyAddressesAboutBalance({
      addresses: [...new Set(participantAddresses)]
    })
  }

  /**
  * Оповестить адреса, участвующие в транзакции о предстоящих изменениях баланса
  */
  async notifyAddressesAboutBalance ({addresses, status = 'confirmed'}) {
    const addressBalances = await this.getAddressesBalance(addresses)

    addressBalances.forEach(async e => {
      this.notificationService.send(e.address, {
        balance: e.balance,
        unconfirmedBalance: e.unconfirmedBalance,
        status
      })
    })
  }

  async getAddressesBalance (addresses) {
    const addressBalances = await Promise.all(
      addresses.map(async address => ({
        address,
        balance: await this.blockChainExplorer.getBalance(address),
        unconfirmedBalance: await this.getUnconfirmedBalanceFromUnconfirmedTx({address, isInputAddress: true}) +
         await this.getUnconfirmedBalanceFromUnconfirmedTx({address, isInputAddress: false})
      }))
    )
    return addressBalances
  }

  /**
  * Считает по unconfirmed транзакциям часть unconfirmedBalance для указанного адреса.
  * isInputAddress - считать unconfirmedBalance по входящим адресам в транзакцию или по исходящим
  */
  async getUnconfirmedBalanceFromUnconfirmedTx ({address, isInputAddress}) {
    const places = {
      txInfoPlace: isInputAddress ? 'inputAddressChanges' : 'outputAddressChanges',
      txPlace: isInputAddress ? 'inputAddresses' : 'outputAddresses'
    }

    let unconfirmedBalance = 0

    const unconfirmedTxWhereAddressInSpecificPlace = await this.getTransactionWithAddressInPlace({
      address: address,
      place: places.txPlace,
      status: 'UNCONFIRMED'
    })

    for (let tx of unconfirmedTxWhereAddressInSpecificPlace) {
      let txInfo = await this.transactionParser.parseRawTx(tx.rawtx)
      const addressChanges = txInfo[places.txInfoPlace].find(e => e.address === address)
      unconfirmedBalance += addressChanges.unconfirmedBalance
    }

    return unconfirmedBalance
  }

  async getTransactionWithAddressInPlace ({address, place, status}) {
    return BlockchainTransactionRepository.find({[place]: address, status})
  }
}

module.exports = TransactionProcessor
