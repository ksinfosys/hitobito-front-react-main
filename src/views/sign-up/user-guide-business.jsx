import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ClassicEditor,
} from "@/base-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserGuideBusiness() {
  // navigate
  const navigate = useNavigate();

  return (
    <>
      <div id="business" className="user-guide-business">
        <div className="box-type-default">       
          <img src="/pdf/1.jpg" alt="" />
          <img src="/pdf/2.jpg" alt="" />
          <img src="/pdf/3.jpg" alt="" />
          <img src="/pdf/4.jpg" alt="" />
          <img src="/pdf/5.jpg" alt="" />
          <img src="/pdf/6.jpg" alt="" />
          <img src="/pdf/7.jpg" alt="" />
          {/* <div className="p-5 border-b border-slate-200/60 text-sm">
          ◇hitobitoのご利用について（企業担当者様）
          </div>
          <div className="p-5 pt-10 pb-10">
            <div className="mb-10">
              <div className="font-bold">１．Hitobitoの会員登録について</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>
                【会員登録】
                </li>
                <li>
                １．会員登録は無料です。
                </li>
                <li>
                ２．メニュー画面のメニューバーから企業会員を選択し、企業ログイン画面を表示させます。
                </li>
                <li>
                ３．新規会員加入を選択して次に進みます。
                </li>
                <li>
                ４．採用のご担当者のメールアドレスに企業会員のご登録用のURLを送付いたします。（メールアドレスは企業会員登録時に変更可能です）
                </li>
                <li>
                ５．企業情報のご登録が完了すると、企業情報で登録されたメールアドレスにhitobitoの「ログインID」を送付いたします。
                </li>
                <li>
                ６．送付された、「ログインID」を使用してパスワード設定をおこないます。
                </li>
                <li>
                ７．パスワード設定が終わりましたら、hitobitoの企業ログイン画面に「ログインID」、「パスワード」を入力して企業TOPメニュー画面を表示させます。
                </li>
                <li>
                ８．企業TOPメニューのプルダウンメニューから必要な機能を選択し、画面を表示させます。
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">２．Hitobitoの「ポイント」および「利用料」について</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ポイント】</li>                  
                    <li>
                    ・hitobitoでは、求職者への面談依頼をおこなう場合には、ポイントが必要となります。
                    </li>
                    <li>
                    　＜ポイントの購入について＞
                    </li>
                    <li>
                    　　・求職者への面談依頼に必要なポイントはアプリ内で1,000ポイント単位で購入できます。
                    </li>
                    <li>
                    　　1,000ポイント＝1,100円（税込み）
                    </li>
                    <li>
                    　　・お支払いは、クレジットカードまたは口座振込になります。
                    </li>
                    <li>
                    　　・お支払いの確認が取れ次第、ポイント残高に反映されます。
                    </li>
                    <li>
                    　　・ポイント残高がないと求職者の詳細情報が確認できません。
                    </li>
              </ul>

              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ご利用料金】</li>
                  <ul>
                    <li>
                    ・毎月のご利用料が無料のフリープランと、有料のプランA、プランBがあります。
                    </li>
                    <li>
                    ・ご利用になるプランにより、1回の面談依頼に必要なポイント数が異なります。
                    </li>
                    <li>
                      <table className="table table-bordered guide-table w-auto">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap bg1 w-32">プラン名</th>
                            <th className="whitespace-nowrap bg1 w-32">面談依頼</th>
                            <th className="whitespace-nowrap bg1 w-32">月額利用料（税別金額）</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="bg3">フリープラン</td>
                            <td>20,000ポイント</td>
                            <td>なし</td>
                          </tr>
                          <tr>
                            <td className="bg3">プランA</td>
                            <td>5,000ポイン</td>
                            <td>15,000円</td>
                          </tr>
                          <tr>
                            <td className="bg3">プランB</td>
                            <td>3,000ポイント</td>
                            <td>30,000円</td>
                          </tr>
                        </tbody>
                      </table>
                    </li>
                  </ul>
              </ul>

              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【プランごとの機能】</li>
                <li>
                  ・ご利用になるプランにより、ご利用できる機能が違います。また、ポイント購入時の購入可能な単位が違います。
                </li>
                <li>
                  <table className="table table-bordered guide-table w-auto">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap bg1 w-32" colSpan={2}>機能</th>
                        <th className="whitespace-nowrap bg1 w-32">フリープラン</th>
                        <th className="whitespace-nowrap bg1 w-32">プランA</th>
                        <th className="whitespace-nowrap bg1 w-32">プランB</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg3" rowSpan={5}>共通</td>
                        <td>求職者検索</td>
                        <td>〇</td>
                        <td>〇</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td>求職者への面談依頼</td>
                        <td>〇</td>
                        <td>〇</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td>面談依頼の管理</td>
                        <td>〇</td>
                        <td>〇</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td>求職者とのメッセージ送受信</td>
                        <td>〇</td>
                        <td>〇</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td>ポイント残高確認</td>
                        <td>〇</td>
                        <td>〇</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td className="bg3" rowSpan={5}>プラン別</td>
                        <td>ポイント購入単位</td>
                        <td>20,000Ｐ</td>
                        <td colSpan={2}>1,000Ｐ</td>
                      </tr>
                      <tr>
                        <td>ポイント購入履歴検索</td>
                        <td>前月分のみ可</td>
                        <td colSpan={2}>当日までの期間指定可</td>
                      </tr>
                      <tr>
                        <td>求人広告掲載</td>
                        <td colSpan={2}>有料</td>
                        <td>期間内は無料</td>                        
                      </tr>
                      <tr>
                        <td>ご担当者様との月１回の打合せ</td>
                        <td>X</td>
                        <td>X</td>
                        <td>〇</td>
                      </tr>
                      <tr>
                        <td>求職者優先紹介（メッセージ連絡）</td>
                        <td>X</td>
                        <td>X</td>
                        <td>〇</td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">３．有料プランの利用料金のお支払いについて</div>
              <p className="mt-1">
              ・ご利用料金の起算日はプランに加入した当日になります。
              </p>
              <p className="mt-1">
              ・ご契約後ただちに、ご利用料金が発生します。
              </p>

              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【サブスクリプション契約コース】</li>
                <li>
                ・１年間のご利用ができる契約になります。
                </li>
                <li>
                ・利用料を毎月お支払いいただくサブスクリプション契約になります。
                </li>
                <li>
                ・お支払いについてはクレジットカードでの決済になります。
                </li>
                <li>
                ・毎月の利用料のお支払いは、起算日を基準に毎月同日に引落されます。
                </li>
                <li>
                ・１年間の契約期間終了後に契約の自動延長はありませんので、継続の場合は再度サブスクリプション契約をお願いします。
                </li>
                <li>
                ・退会およびサブスクリプション契約の途中解約は可能ですが、お支払い済みの利用料の返金はできません。                
                </li>
                <li>
                　ただし、お支払いいただいた分の最終日（次回引落日の前日）までは、それまでと同じようにご利用可能です。
                </li>

                <li>
                　＜毎月のお支払いについて＞
                </li>
                <li>
                　　プランを登録された日（サブスクリプション契約日）によって引落日は異なります。
                </li>
                <li>
                　　例:3月13日にサブスクリプション契約に登録すると、初回お支払い日は3月13日で、その後は毎月13日に月額利用料が引落され翌年の3/12までの契約になります。
                </li>


              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【利用時間帯について】</li>
                <li>· 毎日、2:00amー4:00am（システム停止時間）をはぶく時間帯</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">
                ４．ご利用プランと面談依頼時の必要ポイント数について
              </div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【利用プランについて】</li>
                <li>
                  · 企業は、ご利用するにあたり、利用プランを登録・変更できます。
                  （指定がない場合には、全てフリープラン扱いとなります）
                </li>
                <li>
                  · プランの登録・変更についてはいつでも可能です。 登録・変更されたプランについては、即時適用されます。
                </li>
                <li>
                  · 企業から求職者への面談依頼１回につき、ご加入プラン別に定めたポイント数を使用します。企業から求職者への面談依頼１回につき、ご加入プラン別に定めたポイント数を使用します。
                </li>                
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ポイントの購入について】</li>
                <li>
                  · 企業は、当アプリ内で使用するポイントを予めアプリ内のポイント購入画面から購入することができます。
                </li>
                <li>· 1ポイント＝1円（税抜き金額）</li>
                <li>· 購入単位：1,000ポイント単位</li>
                <li>
                  · ポイントの残高については、当アプリ内で管理され、常に最新のポイント残高が確認できます。
                  <br />
                  · 企業からの面談依頼に対し、求職者が面談を拒否した場合については、その面談依頼に使用したポイント数が返却されます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ポイントの失効】</li>
                <li>
                  当サイトに会員登録している期間については、ポイントは失効しません。
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">５．代金のお支払方法について</div>
              <p className="mt-1">
                · 毎月の利用料およびポイントの購入代金については、以下の方法にてお支払いをお願いいたします。
              </p>
              <ul className="pl-2 flex flex-col gap-1 mt-1">
                <li>· クレッジット、銀行振込</li>
              </ul>
            </div>
            <div className="mb-10">
              <div className="font-bold m"　>６．退会時のポイントの取扱いについて</div>
              <p className="mt-1">
                会員退会の時点で、未使用のポイントが残っている場合には全て失効し、返金および換金はできません。したがいまして、ポイントを全て使用してからの退会をお勧めいたします。
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button type="button" className="btn btn-pending w-80 mt-10 h-48" onClick={()=>navigate('/')}>
              確認</button>
          </div> */}

        </div>
      </div>
    </>
  );
}



export default UserGuideBusiness;
