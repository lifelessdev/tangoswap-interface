import { ChainId, Currency, CurrencyAmount, SmartBCH, Percent, TradeType, Trade as V2Trade } from '@tangoswapcash/sdk'
import React, { useCallback, useMemo } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../../modals/TransactionConfirmationModal'

import CreateModalFooter from './CreateModalFooter'
import CreateModalHeader from './CreateModalHeader'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
function tradeMeaningfullyDiffers(
  ...args: [V2Trade<Currency, Currency, TradeType>, V2Trade<Currency, Currency, TradeType>]
): boolean {
  const [tradeA, tradeB] = args
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmCreateModal({
  currencyA,
  currencyB,
  maxValue,
  minValue,
  stockInputValue,
  moneyInputValue,
  onConfirm,
  onDismiss,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  // minerBribe,
}: {
  isOpen: boolean
  attemptingTxn: boolean
  txHash: string | undefined
  currencyA: Currency
  currencyB: Currency
  maxValue: string
  minValue: string
  stockInputValue: CurrencyAmount<Currency>
  moneyInputValue: CurrencyAmount<Currency>
  onConfirm: () => void  
  swapErrorMessage: string | undefined
  onDismiss: () => void
}) {
  const modalHeader = useCallback(() => {
    return (
      <CreateModalHeader
        currencyA={currencyA}
        currencyB={currencyB}
        maxValue={maxValue}
        minValue={minValue}
        stockInputValue={stockInputValue}
        moneyInputValue={moneyInputValue}
      />
    )
  }, [currencyA, currencyB, minValue, maxValue, stockInputValue, moneyInputValue])

  const modalBottom = useCallback(() => {
    return (
      <CreateModalFooter
        onConfirm={onConfirm}
        swapErrorMessage={undefined}
      />
    )
  }, [stockInputValue, moneyInputValue, currencyA, currencyB, minValue, maxValue])

  // const confirmationContent = useCallback(() => {
  //   return (
  //     <ConfirmationModalContent
  //       title="Confirm Gridex Creation"
  //       onDismiss={() => console.log('dismissed')}
  //       topContent={modalHeader}
  //       bottomContent={modalBottom}
  //     />
  //   )
  // }, [currenciesSelected, modalBottom, modalHeader])

  const pendingText = `Creating a Gridex of ${currencyA?.symbol} + ${currencyB?.symbol}`

  const pendingText2 = ``

    const confirmationContent = useCallback(
      () =>
        swapErrorMessage ? (
          <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
        ) : (
          <ConfirmationModalContent
            title="Confirm Swap"
            onDismiss={onDismiss}
            topContent={modalHeader}
            bottomContent={modalBottom}
          />
        ),
      [onDismiss, modalBottom, modalHeader, swapErrorMessage]
    )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      pendingText2={pendingText2}
      // currencyToAdd={trade?.outputAmount.currency}
    />
  )
}
