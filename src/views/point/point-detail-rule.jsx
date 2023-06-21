import React, {useEffect} from "react";
import { color } from "../../utils/utils";
import { Link, useNavigate } from "react-router-dom";

const PointDetailRule = () => {
  const navigate = () => {
    if(document.referrer){
      window.close();
    } else {
      location.href = "/";
    }
  }
  
  return(<> 
    <div className="find-wrap flex flex-col items-center">
      <div className="box-type-default">
        <div className="p-5 pt-10 pb-10"> 
          <div className="font-bold font-16">「特定商取引法に基づく表記」</div>
            <div className="mb-10"> 
              <div>
                本決済規約（以下、「本規約」といいます。）は、ＫＳ情報システム株式会社（以下、「当社」といいます。）が提供するアプリ「hitobito」（以下、「本アプリ」といいます。）の企業側における決済行為に関する規定です。本規約にご同意いただくことで、本アプリの決済機能を利用することができます。本アプリの利用にあたっては、本規約をよくお読みいただき、ご理解いただいた上でご利用ください。
                <div className="font-bold"><br /><br />ポイント購入に関する決済</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      1.1 ポイントは、本アプリ内の面談依頼機能を利用するために必要なものです。ポイントは購入することで取得され、ポイントの有効期限は設定されておりません。
                      </li>
                      <li>
                      1.2 ポイントの購入には、以下の決済方法が利用できます：
                      </li>
                      <li>
                      　1.2.1 クレジット決済：クレジットカード情報を使用しての決済が可能です。
                      </li>
                      <li>
                      　1.2.2 コンビニ決済：指定されたコンビニエンスストアでの支払いが可能です。
                      </li>
                      <li>
                      1.3 ポイントの購入後、一度購入したポイントは返金や換金ができません。ご注意ください。
                      </li>  
                    </ul>                               
                  </div>        
                <div className="font-bold"><br /> 有料プランに伴う利用料の支払い</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      2.1 本アプリには有料プランが設定されており、有料プランの利用には一定の利用料が発生します。
                      </li>
                      <li>
                      2.2 有料プランの利用料は、以下の決済方法を利用して支払うことができます：
                      </li>
                      <li>
                      　2.2.1 クレジット決済：クレジットカード情報を使用しての決済が可能です。
                      </li>
                      <li>
                      　2.2.2 コンビニ決済：指定されたコンビニエンスストアでの支払いが可能です。
                      </li>
                      <li>
                      2.3 支払済の利用料については、一度支払った利用料の払い戻しはできません。ご注意ください。
                      </li>
                      <li>
                      　（注）ポイントおよび有料プランの詳細については、<a href="/user-guide-business" target="_blank" rel="noopener noreferrer" style={{color:"orange", fontWeight:"bold"}}>利用ガイド</a>を参照してください。
                      </li>
                    </ul>
                  </div>
                <div className="font-bold"><br /> ポイント残高と未使用の利用料に関する取扱い</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      3.1 退会時にポイント残高や有料プランの未使用の利用料があっても、返金や換金は一切行われません。ご了承ください。
                      </li>
                    </ul>
                  </div>
                <div className="font-bold"><br /> 決済代行会社の利用規約</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      4.1 当社は、決済処理を行うために、決済代行会社を利用しています。決済代行会社の利用規約は、本アプリの利用規約とは別に適用されます。決済代行会社の利用規約には、決済手続き、個人情報の取り扱い、セキュリティ対策などに関する規定が含まれています。本アプリの決済機能を利用する際には、決済代行会社の利用規約にもご留意いただく必要があります。
                      </li>
                    </ul>
                  </div>
                <div className="font-bold"><br /> クレジット情報の取り扱い</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      5.1 当社は、クレジット決済において利用されるクレジットカード情報を一切保持しません。クレジットカード情報は、決済代行会社を通じて直接処理されます。当社はクレジットカード情報の安全性を確保するために、適切な技術的対策を講じますが、クレジットカード情報の管理については決済代行会社の利用規約が適用されます。
                      </li>
                    </ul>
                  </div>

                <div className="font-bold"><br /> お支払い方法</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      6.1 クレジットカードもしくはコンビニ決済
                      </li>
                    </ul>
                  </div>

                <div className="font-bold"><br /> 販売価格</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      7.1 購入画面に表示
                      </li>
                    </ul>
                  </div>

                <div className="font-bold"><br /> 追加手数料</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      8.1 商品/サービスの特性上送料は発生いたしません。
                      </li>
                    </ul>
                  </div>

                <div className="font-bold"><br /> 配送・引渡しについて</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      9.1 クレジットカード：注文後すぐにご利用いただけます。
                      </li>
                      <li>
                      9.2 コンビニ決済：コンビニで入金した後、ご利用いただけます。
                      </li>
                    </ul>
                  </div>

                <div className="font-bold"><br /> 免責事項</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      10.1 当社は、決済機能の提供に際して合理的な注意を払い、安全性を確保するために努力しますが、以下の場合において生じた損害について一切の責任を負いません：
                      </li>
                      <li>
                      　10.1.1 システム障害や通信回線の不具合による決済処理の遅延、中断、失敗等の問題。
                      </li>
                      <li>
                      　10.1.2 本アプリの利用者が不正行為を行った場合や第三者による不正アクセスなどによって生じた損害。
                      </li>
                      <li>
                      　10.1.3 決済代行会社による決済処理や個人情報の取り扱いに関する問題。
                      </li>                      
                    </ul>
                  </div>   
                <div className="font-bold"><br /> 決済規約の変更</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      11.1 当社は、必要に応じて本決済規約を変更することがあります。変更後の利用規約は、本アプリ上での掲示または通知により公表されます。変更後の利用規約にご同意いただくことで、引き続き本アプリの決済機能を利用することができます。
                      </li>
                    </ul>
                  </div>
                <div className="font-bold"><br /> 有効期間</div>
                  <div>
                    <ul className="p-2 flex flex-col gap-1 mt-3">
                      <li>
                      12.1 本決済規約は、利用者が本アプリの決済機能を利用する間、または本アプリの利用者登録が終了した後も有効です。
                      </li>
                    </ul>
                  </div>

                <div>
                  <br />アプリ運営会社　：　KS情報システム株式会社
                  <br />運営会社住所　　：　〒103-0003 東京都中央区日本橋横山町９−１３ イワモトビル ２階
                  <br />サポート対応時間：　09:00 - 18:00
                  <br />電話番号　　　　：　03-6380-4603
                  <br />メールアドレス　：　ksinfosys.co.ltd@gmail.com
                  <br />運営統括責任者　：　金仁鉉
                </div>              
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
            <button type="button" className="btn btn-pending w-80 m-5 h-48" onClick={()=>navigate()}>
              確認</button>
          </div>
      </div>
    </div>
  </>);
};

export default PointDetailRule;