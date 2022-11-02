import { classNames, formatNumber, formatPercent } from '../../functions'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { ZERO } from '@tangoswapcash/sdk'
import { Disclosure } from '@headlessui/react'
import DoubleLogo from '../../components/DoubleLogo'
import Image from '../../components/Image'
import React from 'react'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { isMobile } from 'react-device-detect'
import { usePendingSushi } from '../onsen/hooks'
import usePendingReward from '../onsen/usePendingReward'
import RobotListItemDetails from './RobotListItemDetails'
import { PairType } from '../onsen/enum'
import { useState } from 'react'

const RobotListItems = ({ stockAddress, moneyAddress, robot, ...rest }) => {
  const token0 = robot?.stock
  const token1 = robot?.money
  
  const pendingSushi = usePendingSushi(robot)
  const rewardAmount = usePendingReward(robot)

  const { i18n } = useLingui()
  return (
    <Disclosure {...rest}
    
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              open && 'rounded-b-none',
              'w-full px-4 py-6 text-left rounded cursor-pointer select-none bg-dark-900 text-primary text-sm md:text-lg'
            )}
          >
            <div className={isMobile ? "grid grid-cols-5":"grid grid-cols-4" }>
              <div className="flex col-span-2 space-x-5 md:col-span-1">
                <DoubleLogo currency0={token0} currency1={token1} size={isMobile ? 30 : 40} />
                <div className="flex flex-col justify-center">
                  <div>
                    <p className="font-bold">{token0?.symbol}</p>
                    <p className={robot?.pair?.type === PairType.KASHI ? 'font-thin' : 'font-bold'}>
                      {token1?.symbol}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center font-bold">
                $ {String(robot.lowPrice).slice(0,6)}
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="font-bold text-righttext-high-emphesis">
                  $ {String(robot.highPrice).slice(0,6)}
                </div>
              </div>
              {pendingSushi && pendingSushi.greaterThan(ZERO) ? (
                <div className="flex flex-col items-center justify-center md:flex-row space-x-4 font-bold md:flex">
                  <div className="hidden md:flex items-center space-x-2">

                    {robot?.rewards?.map((reward, i) => (
                      <div key={i} className="flex items-center">
                        <Image
                          src={reward.icon}
                          width="30px"
                          height="30px"
                          className="rounded-md"
                          layout="fixed"
                          alt={reward.token}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-1">
                    {robot?.rewards?.map((reward, i) => (
                      <div key={i} className="text-xs md:text-sm whitespace-nowrap">
                        {i == 0 ? formatNumber(pendingSushi.toFixed(18)) : formatNumber(rewardAmount)} {reward.token}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (<div>
                <div className="flex-row items-center justify-center flex pl-3 font-bold text-sm">
                  {i18n._(t`Stock: ${robot.stockAmount}`)}
                </div>
                <div className="flex-row items-center justify-center flex pl-3 font-bold text-sm">
                {i18n._(t`Money: ${robot.stockAmount}`)}
                </div>
                </div>
              )}
            </div>
          </Disclosure.Button>
          {open && <RobotListItemDetails stockAddress={stockAddress} moneyAddress={moneyAddress} robot={robot} />}
        </>
      )}
    </Disclosure>

    
  )
}

export default RobotListItems

// robot.rewards.length > 1 ? `& ${formatNumber(reward)} ${robot.rewards[1].token}` : ''
