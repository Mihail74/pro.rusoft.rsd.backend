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

const makeTransferDepositShort = deposit => deposit == null ? null : ({
  id: deposit._id,
  project: makeProjectShort(deposit.project),
  transfer: makeBlockchainTransactionShort(deposit.transfer)
})

const makeTransferWithdrawalShort = withdrawal => withdrawal == null ? null : ({
  id: withdrawal._id,
  project: makeProjectShort(withdrawal.project),
  transfer: makeBlockchainTransactionShort(withdrawal.transfer)
})

const makeProjectShort = project => project == null ? null : ({
  id: project._id,
  name: project.name,
  description: project.description,
  thumbnail: makeImageShort(project.thumbnail),
  owner: makeUserShort(project.owner),
  members: project.members.map(makeUserShort)
})

module.exports = {
  makeUserShort,
  makeWalletShort,
  makeProjectShort,
  makeTransferDepositShort,
  makeTransferWithdrawalShort,
  makeBlockchainTransactionShort
}
