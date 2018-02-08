const services = requireRoot('lib/services')

const makeImageShort = image => image == null ? null : ({
  ...image
})

const makeUserShort = user => user == null ? null : ({
  id: user._id,
  email: user.email,
  name: user.name,
  avatar: makeImageShort(user.avatar)
})

const makeWalletShort = wallet => wallet == null ? null : ({
  id: wallet._id,
  address: wallet.address,
  createdDate: wallet.createdDate,
  type: wallet.type,
  user: makeUserShort(wallet.user)
})

const makeBlockchainTransactionShort = transaction => transaction == null ? null : ({
  id: transaction._id,
  hash: transaction.hash,
  createdDate: transaction.createdDate,
  status: transaction.status,
  type: transaction.type,
  inputAddresses: transaction.inputAddresses,
  outputAddresses: transaction.outputAddresses
})

const makeTransferDepositShort = async deposit => deposit == null ? null : ({
  id: deposit._id,
  project: await makeProjectShort(deposit.project),
  transfer: makeBlockchainTransactionShort(deposit.transfer)
})

const makeTransferWithdrawalShort = async withdrawal => withdrawal == null ? null : ({
  id: withdrawal._id,
  project: await makeProjectShort(withdrawal.project),
  transfer: makeBlockchainTransactionShort(withdrawal.transfer)
})

const makeProjectShort = async project => {
  if (project == null) {
    return null
  }
  const info = await services.blockChainExplorer.getAddressInfo(project.address.address)

  return {
    id: project._id,
    name: project.name,
    description: project.description,
    targetValue: project.targetValue,
    thumbnail: makeImageShort(project.thumbnail),
    owner: makeUserShort(project.owner),
    members: project.members.map(makeUserShort),
    balance: Math.round(info.balance * 1e8),
    unconfirmedBalance: Math.round(info.unconfirmedBalance * 1e8),
    createdDate: project.createdDate,
    startedDate: project.startedDate,
    dueDate: project.dueDate,
    status: project.status,
    address: project.address.address
  }
}

module.exports = {
  makeUserShort,
  makeWalletShort,
  makeProjectShort,
  makeTransferDepositShort,
  makeTransferWithdrawalShort,
  makeBlockchainTransactionShort
}
