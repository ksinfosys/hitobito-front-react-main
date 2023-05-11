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
          <div className="p-5 border-b border-slate-200/60 text-sm">
            hitobitonoご利用について
          </div>
          <div className="p-5 pt-10 pb-10">
            <div className="mb-10">
              <div className="font-bold">１．hitobitoの特徴</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>
                  【 IT技術者の就活と、企業の採用を支援するマッチングアプリ】
                </li>
                <li>
                  · 自分に合った企業を求めるIT技術者と、IT技術者をスカウトしたい企業の採用担当者を結ぶマッチングアプリです。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【会員登録は無料】</li>
                <li>
                  · 求職者様、企業の採用担当者様のどちらも会員登録は無料です。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【IT技術者のスキルを見える化】</li>
                <li>
                  · IT技術者として特徴のあるスキルや実績を、「見える化」して経歴情報として登録。
                </li>
                <li>
                  · そのため、企業にとっても求職者の特徴を把握し易く、自社の要望にベストマッチした人材を探せます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談依頼の送信時にはポイントが必要】</li>
                <li>
                  · 企業がIT技術者をスカウトする際の面談依頼の送信については、当アプリ内で使用するポイントが必要になります。
                  <ul className="pl-2 mt-1">
                    <li>
                      → 後述の「ご加入プランと面談依頼のポイント数について」をご参照ください。
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">２．当アプリの機能</div>
              <p className="mt-1">
                求職者と企業の採用面談の実施までの下記プロセスで必要となる機能をご利用いただけます。
              </p>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【利用可能な機能について】</li>
                <li>
                  <div className="overflow-x-scroll">
                    <table className="table table-bordered guide-table">
                      <thead>
                        <tr>
                          <th rowSpan={3} className="whitespace-nowrap bg1">
                            ご利用者
                          </th>
                          <th colSpan={10} className="whitespace-nowrap bg1">
                            hitobitoの機能
                          </th>
                        </tr>
                        <tr>
                          <th rowSpan={2} className="whitespace-nowrap bg2">
                            会員登録
                          </th>
                          <th rowSpan={2} className="whitespace-nowrap bg2">
                            経歴登録
                          </th>
                          <th rowSpan={2} className="whitespace-nowrap bg2">
                            求職者検索
                          </th>
                          <th colSpan={5} className="whitespace-nowrap bg2">
                            当アプリメッセージ機能
                          </th>
                          <th rowSpan={2} className="whitespace-nowrap bg2">
                            ポイント購入
                          </th>
                          <th rowSpan={2} className="whitespace-nowrap bg2">
                            ポイント交換
                          </th>
                        </tr>
                        <tr>
                          <th className="whitespace-nowrap bg2">
                            面談依頼送信
                          </th>
                          <th className="whitespace-nowrap bg2">
                            面談依頼回答
                          </th>
                          <th className="whitespace-nowrap bg2">
                            面談実施報告
                          </th>
                          <th className="whitespace-nowrap bg2">
                            面談実施確認
                          </th>
                          <th className="whitespace-nowrap bg2">その他連絡</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="bg3">企業</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                        </tr>
                        <tr>
                          <td className="bg3">求職者</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                          <td>O</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-pending text-sm mt-1">
                    〇：利用可能　 / 　×：利用不可
                  </p>
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">　３．利用端末と利用時間帯について</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【利用端末について】</li>
                <li>
                  <table className="table table-bordered guide-table w-auto">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap bg1 w-32">ご利用者</th>
                        <th className="whitespace-nowrap bg1 w-32">PC</th>
                        <th className="whitespace-nowrap bg1 w-32">Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg3">企業</td>
                        <td>O</td>
                        <td>X</td>
                      </tr>
                      <tr>
                        <td className="bg3">求職者</td>
                        <td>O</td>
                        <td>O</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-pending text-sm mt-1">
                    〇：利用可能　 / 　×：利用不可
                  </p>
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
                <li>
                  <table className="table table-bordered guide-table w-auto">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap bg1 w-32">プラン</th>
                        <th className="whitespace-nowrap bg1 w-24">
                          月額利用料
                        </th>
                        <th className="whitespace-nowrap bg1 w-24">契約時間</th>
                        <th className="whitespace-nowrap bg1 w-48">
                          面談依頼時の必要ポイント数
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="bg3">フリープラン</td>
                        <td>ー</td>
                        <td>ー</td>
                        <td>20,000ポイント </td>
                      </tr>
                      <tr>
                        <td className="bg3">プランA</td>
                        <td>15,000円</td>
                        <td>1年</td>
                        <td>5,000ポイント</td>
                      </tr>
                      <tr>
                        <td className="bg3">プランB</td>
                        <td>30,000円</td>
                        <td>1年</td>
                        <td>3,000ポイント</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-pending text-sm mt-1">
                    （金額は全て税抜き金額になります）
                  </p>
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【プラン別の機能について】</li>
                <li>
                  <table className="table table-bordered guide-table w-auto">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap bg1 w-32">
                          フリープラン
                        </th>
                        <th className="whitespace-nowrap bg1 w-24">プランA</th>
                        <th className="whitespace-nowrap bg1 w-24">プランB</th>
                        <th className="whitespace-nowrap bg1">機能</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>O</td>
                        <td>O</td>
                        <td>O</td>
                        <td>メッセージ送受信</td>
                      </tr>
                      <tr>
                        <td>O</td>
                        <td>O</td>
                        <td>O</td>
                        <td>ポイント残高表示</td>
                      </tr>
                      <tr>
                        <td>O</td>
                        <td>O</td>
                        <td>O</td>
                        <td>ポイント推移表（前月分のみ</td>
                      </tr>
                      <tr>
                        <td>X</td>
                        <td>O</td>
                        <td>O</td>
                        <td>ポイント推移表（期間指定、当日分を含む）</td>
                      </tr>
                      <tr>
                        <td>X</td>
                        <td>O</td>
                        <td>O</td>
                        <td>年間支払金額によるポイント付与（毎年12月末締）</td>
                      </tr>
                      <tr>
                        <td>X</td>
                        <td>X</td>
                        <td>O</td>
                        <td>企業側担当者との月１回の対面ミーティング</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-pending text-sm mt-1">
                    〇：利用可能　 / 　×：利用不可
                  </p>
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
            <button type="button" className="btn btn-pending w-80 mt-10 h-48" onClick={handleClick}>
              確認</button>
          </div>

        </div>
      </div>
    </>
  );
}

function handleClick(e){
  window.location.replace("/business")
}


export default UserGuideBusiness;
