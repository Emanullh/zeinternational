import React, { useEffect } from 'react'

const BetssonBanner: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://c.bannerflow.net/a/66d093873ec9f495810c7169?did=657fff592225a91f2b2e2296&deeplink=on&adgroupid=66d093873ec9f495810c716b&redirecturl=https://record.betsson.com/_3kUZiOfSVrUyGSrLOh2Z7yMsVN57gzkV/1/&media=208754&campaign=1'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="w-full h-[90px]">
      <div id="bannerflow-container" className="w-full h-full" />
    </div>
  )
}

export default BetssonBanner
