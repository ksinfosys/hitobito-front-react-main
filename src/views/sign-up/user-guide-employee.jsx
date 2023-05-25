import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ClassicEditor,
} from "@/base-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserGuideEmployee() {

//navigate
const navigate = useNavigate();
  
  return (
    <>
      <div id="employee" className="user-guide-employee">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            hitobitoのご利用について
          </div>
          <div className="p-5 pt-10 pb-10">
            <div className="mb-10">
              <div className="font-bold m">１．hitobitoはSNSアカウント（LINE、Kakao、Apple）でログインできます。</div>
            </div>

            <div className="mb-10">
              <div className="font-bold m">２．ご登録から面談実施までの流れ</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【ニックネームの登録】</li>
                <li>
                ・会員登録時にニックネームを入力していただき、採用企業側には匿名での表示になります。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【経歴情報の登録】</li>
                <li>
                ・IT技術者としての経歴情報のご登録については、企業側が見たいポイントを整理した登録方法となっております。
                </li>
                <li>
                ・過去の実績をアピールする手段としてSNSやGitHubのアカウントも入力可能です。
                </li>
                <li>
                ・また、企業側にアピールするための紹介資料などのファイルも登録できます。
                </li>
                <li>
                ・そのため、自分で企業の採用情報を探すのではなく、IT技術者を採用したい企業からスカウトの面談依頼が届くことになります。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談依頼への回答】</li>
                <li>
                ・面談依頼が届いた相手先の企業情報や求人情報の詳細が確認できます。
                </li>
                <li>
                ・面談してみたい企業には面談受諾を、面談したくない企業には拒否を送信することができます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談依頼の受諾後について】</li>
                <li>
                ・面談依頼を受諾した場合のみ、相手企業に対し個人情報および経歴情報の詳細が開示されます。
                </li>
                <li>
                ・企業との面談日時調整などの連絡は当アプリのメッセージを利用しておこないます。
                </li>
              </ul>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>【面談実施後について】</li>
                <li>
                ・実際に企業との面談をおこなったあとに、採用可否に関係なく面談実施済の報告を入力していただきます。
                </li>
                <li>
                ・面談実施報告について相手先企業の確認がとれると、企業が面談依頼に使用したポイントの一部が求職者に還元されます。
                </li>
                <li>
                ・還元されたポイントについては、ポイント交換機能を使用してAmazonのギフト券に交換できます。
                </li>
              </ul>

            <div className="mb-10"></div>

            <div className="mb-10">
              <div className="font-bold m">３．個人情報の開示タイミングについて</div>
              <ul className="p-2 flex flex-col gap-1 mt-3">
                <li>・企業からの面談依頼を承諾した場合は、相手企業に個人情報および経歴情報の詳細が開示されます。</li>               
              </ul>              
            </div>
            
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button type="button" className="btn btn-primary w-80 mt-10 h-48" onClick={()=>navigate('/')}>
              確認</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserGuideEmployee;
