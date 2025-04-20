import DealsPage from '../../(components)/deals/DealsPage'
import DefaultPageBanner from '../../(components)/DefaultPageBanner'
import React from 'react'

const page = () => {
  return (
    <>
     <DefaultPageBanner title="Deals & Bids" backgroundImage={''} />
     <DealsPage/>
    </>
  )
}

export default page