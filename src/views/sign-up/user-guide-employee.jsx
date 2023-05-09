import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ClassicEditor,
} from "@/base-components";
import { useState } from "react";
import { Link } from "react-router-dom";

function UserGuideEmployee() {
  return (
    <>
      <div id="business" className="user-guide-business employee">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            hitobitonoご利用について
          </div>
          <div className="p-5 pt-10 pb-10">
            <div className="mb-10">
              <div className="font-bold">１．hitobitoの特徴</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>
                  【IT技術者の就活と、企業の採用を支援するマッチングアプリ】
                </li>
                <li>
                  · 自分に合った企業を求めるIT技術者と、IT技術者をスカウトしたい企業の採用担当者を結ぶマッチングアプリです。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【会員登録は無料】</li>
                <li>
                  ・ 求職者様、企業の採用担当者様のどちらも会員登録は無料です。
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
                ・ 求職者と企業の採用面談の実施までの下記プロセスで必要となる機能をご利用いただけます。
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

                  <p className="text-primary text-sm mt-1">
                    〇：利用可能　 / 　×：利用不可
                  </p>
                </li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="font-bold m">３．利用端末と利用時間帯について</div>
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
                  <p className="text-primary text-sm mt-1">
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
                ４．ご登録から面談実施までの流れ
              </div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ニックネームの登録】</li>
                <li>
                  · 会員登録時にニックネームを入力していただき、採用企業側には匿名での表示になります。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【経歴情報の登録】</li>
                <li>
                  · IT技術者としての経歴情報のご登録については、企業側が見たいポイントを整理した登録方法となっております。
                </li>
                <li>
                  · 過去の実績をアピールする手段としてSNSやGitHubのアカウントも入力可能です。
                </li>
                <li>
                  · また、企業側にアピールするための紹介資料などのファイルも登録できます。
                </li>
                <li>
                  · そのため、自分で企業の採用情報を探すのではなく、IT技術者を採用したい企業からスカウトの面談依頼が届くことになります。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談依頼への回答】</li>
                <li>
                  · 面談依頼が届いた相手先の企業情報や採用情報の詳細が確認できます。
                </li>
                <li>
                  · 相手先企業の社員の方が、企業SNSである「tomodomo」を利用している場合には、相手先企業の雰囲気も確認できます。
                </li>
                <li>
                  · 面談してみたい企業には面談受諾を、面談したくない企業には拒否を送信することができます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談依頼の受諾後について】</li>
                <li>
                  · 面談依頼を受諾した場合のみ、相手企業に対し個人情報および経歴情報の詳細が開示されます。
                </li>
                <li>
                  · 企業との面談日時調整などの連絡は当アプリのメッセージを利用しておこないます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談実施後について】</li>
                <li>
                  · 実際に企業との面談をおこなったあとに、採用可否に関係なく面談実施済の報告を入力していただきます。
                </li>
                <li>
                  · 面談実施報告について相手先企業の確認がとれると、企業が面談依頼に使用したポイントの一部が求職者に還元されます。
                </li>
                <li>
                  · 還元されたポイントについては、Amazonのギフト券に交換できます。
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button type="button" className="btn btn-primary w-80 mt-10">確認</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserGuideEmployee;
