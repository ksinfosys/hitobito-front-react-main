import {} from "@/base-components";
import { useState } from "react";

import AmazonCard from "@/assets/images/amazon-giftcard.svg";
import AmazonCardDisabled from "@/assets/images/amazon-giftcard_disabled.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { regexUserPoint } from "../../utils/utils";


// 기프트 카드 모바일 분기
import GiftcardRegistM from './giftcard-regist-mobile';


function GiftcardRegist() {
  const location = useLocation();
  console.log(location.state);

  const navigate = useNavigate();

  return (
    <>
      <div id="giftcard-regist" className="hidden lg:block">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            Amazonギフトカード登録
          </div>
          {location.state !== null ? (
            <div className="cont-wrap py-10 px-5 ">
              <div className="font-xl mb-5">
                <span className="text-primary font-bold mr-2 mb-1 block lg:inline-block lg:mb-0">
                  ポイント交換完了!
                </span>
               Amazonギフトカードが発行されました。
              </div>
              <div className="relative flex flex-col lg:flex-row items-center flex-start gap-5 p-3 bg-lb">
                <div>
                  <img src={AmazonCard} alt="" />
                </div>
                <ul>
                  <li className="font-bold">Amazonギフトカード</li>
                  <li className="mt-5">
                    {location.state.agc.gcClaimCode}
                    <span className="font-bold ml-10">(¥{regexUserPoint(location.state.agc.amount)})</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="relative lg:absolute right-0 bottom-0 m-3 btn btn-primary w-72"
                >
                  Amazonに登録
                </button>
              </div>
            </div>
          ) : (
            <p>
                <div className="cont-wrap py-10 px-5 ">
                    <div className="font-xl mb-5"><span className="text-primary font-bold mr-2 mb-1 block lg:inline-block lg:mb-0">登録されたカードがありません。</span>ポイントを交換してください。</div>
                    <div className="relative flex flex-col lg:flex-row items-center flex-start gap-5 p-3 bg-lb">
                        <div>
                            <img src={AmazonCardDisabled} alt="" />
                        </div>
                        <div className="flex ">

                        </div>
                        <button type="button" className="relative m-3 btn btn-primary w-72"
                            onClick={() => {
                                navigate("/point-detail")
                            }}
                        >ポイント交換</button>
                    </div>
                </div>
            </p>
          )}
        </div>
      </div>

      {/* 기프트 카드 모바일 */}
      <GiftcardRegistM/>
      
    </>
  );
}

export default GiftcardRegist;
