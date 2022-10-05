import React,{ useState } from "react"
import NavLink from "../../../components/NavLink"
import Head from "next/head"
import Container from "../../../components/Container"
import DoubleGlowShadow from "../../../components/DoubleGlowShadow"
import CurrencyInputPanel from "../../../components/CurrencyInputPanel"
import { Currency, CurrencyAmount, Percent, WNATIVE, currencyEquals } from '@tangoswapcash/sdk'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../../state/mint/hooks'
import { useCurrency } from '../../../hooks/Tokens'
import { useRouter } from 'next/router'
import { Field } from '../../../state/mint/actions'
import { currencyId, maxAmountSpend } from '../../../functions/currency'
import BuyRobotsPanel from "../../../components/BuyRobotsPanel"

export default function BuyGridex() {
  const [currenciesSelected, setCurrenciesSelected] = useState(null);

  const handleCurrencyASelect = (currencyA: Currency) => {
    console.log('currencyA:', currencyA)
    setCurrenciesSelected({...currenciesSelected, currencyA: currencyA})
  }
  const handleCurrencyBSelect = (currencyB: Currency) => {    
    setCurrenciesSelected({...currenciesSelected, currencyB: currencyB})      
  }
  
  const router = useRouter()
  const tokens = router.query.tokens
  const [currencyIdA, currencyIdB] = (tokens as string[]) || [undefined, undefined]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currenciesSelected?.currencyA ?? undefined, currenciesSelected?.currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {}
  )
  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {}
  )

  // console.log(currenciesSelected.currencyB);

  return (<>
    <Head>
      <title>Buy Gridex | Orders.Cash</title>
      <meta
        key="description"
        name="description"
        content="Add liquidity to the TANGOswap AMM to enable gas optimised and low slippage trades across countless networks"
      />
    </Head>

    <Container id="buy-robot-page" className="py-4 space-y-6 w-4/4 md:py-8 lg:py-12" maxWidth="2xl">
      <DoubleGlowShadow className="w-full">
        
        <BuyRobotsPanel
        label="Stock"
        id="stock-robot-search"
        showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
        onUserInput={onFieldBInput}
        onMax={() => {
          onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
        }}
        onCurrencySelect={handleCurrencyASelect}
        onCurrencyBSelect={handleCurrencyBSelect}
        currency={currenciesSelected && currenciesSelected.currencyA && currenciesSelected.currencyA}
        currencyB={currenciesSelected && currenciesSelected.currencyB && currenciesSelected.currencyB}
        // onOtherCurrencySelect={handleCurrencyBSelect}
        // otherCurrency={currenciesSelected && currenciesSelected.currencyB && currenciesSelected.currencyB}
        showCommonBases
        />
        
      </DoubleGlowShadow>
    </Container>
  </>

  )
}
{/* <NavLink href="/robots/robots-list/buy"> 
    
    <Button
      variant='outlined'
      color='border'
      className='w-[190px] text-[#E3E3E3] flex items-center gap-2'
    >
      <PlusIcon width={16} height={16}/>
      {i18n._(t`Buy Gridex`)}
  </Button>

</NavLink> */}




{/*
<div id="options-container" className="flex items-center bg-blue text-black ">
            <label className="text-green mr-4">Stock</label>
            <input type="text" className="buy-options  bg-gray-300"/>
            <label className="text-green mx-4">Money</label>
            <input type="text" className="buy-options  bg-gray-300"/>
            <label className="text-green mx-4">Balance</label>
            <input type="text" className="buy-options  bg-gray-300"/>
            <input type="submit" className="mx-4 px-4 py-2 text-green bg-gray-500"/>
          </div>


*/}