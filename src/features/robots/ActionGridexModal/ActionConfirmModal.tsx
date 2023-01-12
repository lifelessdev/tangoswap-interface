import ActionModalHeader from '../../../features/robots/ActionGridexModal/ActionModalHeader'
import ActionModalFooter from '../../../features/robots/ActionGridexModal/ActionModalFooter'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../../modals/TransactionConfirmationModal'
import React, { useCallback } from 'react'
import { Currency } from '@tangoswapcash/sdk'
import { Contract } from '@ethersproject/contracts'

export default function ConfirmCreateModal({
isOpen,
attemptingTxn,
hash,
currencyA,
currencyB,
onConfirm,
txErrorMsg,
onDismiss,
stockContract,
moneyContract,
marketContract,
factoryContract,
index,
robotId
}: {
    isOpen: boolean
    attemptingTxn: boolean
    hash: string | undefined
    currencyA: Currency
    currencyB: Currency
    onConfirm: () => void  
    txErrorMsg: string | undefined
    onDismiss: () => void
    stockContract: Contract
    moneyContract: Contract
    marketContract: Contract
    factoryContract: Contract
    index: number | string
    robotId: number | string
}) {
const pendingText = `This is the action modal`
const pendingText2 = ``

const modalHeader = useCallback(() => {
  return <ActionModalHeader currencyA={currencyA} currencyB={currencyB} />
}, [currencyA, currencyB])

const modalBottom = useCallback(() => {
  return <ActionModalFooter onConfirm={onConfirm} txErrorMsg={txErrorMsg} />
}, [modalHeader, currencyA, currencyB, stockContract, moneyContract, marketContract, factoryContract, index, robotId])

const confirmationContent = useCallback(
  () => (
    <ConfirmationModalContent
      title="Confirm Action"
      onDismiss={onDismiss}
      topContent={modalHeader}
      bottomContent={modalBottom}
    />
  ),
  [modalBottom, modalHeader]
)

return (
    <TransactionConfirmationModal
    isOpen={isOpen}
    onDismiss={onDismiss}
    attemptingTxn={attemptingTxn}
    hash={hash}
    content={confirmationContent}
    pendingText={pendingText}
    pendingText2={pendingText2}
  />
)

}
