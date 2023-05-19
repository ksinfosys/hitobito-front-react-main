
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Modal, ModalBody,
} from "@/base-components";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";


const SignupEmployeeTerm = () => {

    const navigate = useNavigate();

    const [signupModal, setsignupModal] = useState(false);

    // Modal State
    const [modalState01, setModalState01] = useState(false);
    const [modalState02, setModalState02] = useState(false);

    // 체크버튼 State
    const [agreeState01, setAgreeState01] = useState(false);
    const [agreeState02, setAgreeState02] = useState(false);

    // 약관 동의후 회원가입 페이지 진입
    const agreeSubmit = () => {
        !agreeState01 ? setModalState01(true) :
            !agreeState02 ? setModalState02(true) : navigate('/signup-business');
    };

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <div className="term-tit">
                    企業会員加入
                </div>
                <div className="term-subtit">
                    利用規約
                </div>
                <div className="term-wrap">
                    <div className="term-div">
                    この利用規約（以下、「本規約」といいます。）は、ＫＳ情報システム株式会社（以下、「当社」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録利用者の皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
                    <br />
                    第1条（適用）
                    <br />
                    1. 本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
                    <br />
                    2. 当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
                    <br />
                    3. 本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。
                    <br />
                    第２条（利用登録）
                    <br />
                    1. 本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
                    <br />
                    2. 当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                    <br />
                    (1) 利用登録の申請に際して虚偽の事項を届け出た場合
                    <br />
                    (2) 本規約に違反したことがある者からの申請である場合
                    <br />
                    (3) その他、当社が利用登録を相当でないと判断した場合
                    <br />
                    第3条（ユーザーIDおよびパスワードの管理）
                    <br />
                    1. ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                    <br />
                    2. ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
                    <br />
                    3. ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。
                    <br />
                    第4条（利用料金および支払方法）
                    <br />
                    1. 企業ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。
                    <br />
                    2. ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14．6％の割合による遅延損害金を支払うものとします。
                    <br />
                    第5条（禁止事項）
                    <br />
                    ユーザーは、本サービスの利用にあたり、以下の行為をしてはならない。
                    <br />
                    1. 法令または公序良俗に違反する行為
                    <br />
                    2. 犯罪行為に関連する行為
                    <br />
                    3. 本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為
                    <br />
                    4. 当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                    <br />
                    5. 本サービスによって得られた情報を商業的に利用する行為
                    <br />
                    6. 当社のサービスの運営を妨害するおそれのある行為
                    <br />
                    7. 不正アクセスをし、またはこれを試みる行為
                    <br />
                    8. 他のユーザーに関する個人情報等を収集または蓄積する行為
                    <br />
                    9. 不正な目的を持って本サービスを利用する行為
                    <br />
                    10. 本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
                    <br />
                    11. 一人の利用者が複数の利用者IDを取得するなどして他のユーザーに成りすます行為
                    <br />
                    12. 当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為
                    <br />
                    13. 面識のない異性との出会いを目的とした行為
                    <br />
                    14. 当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
                    <br />
                    15. その他、当社が不適切と判断する行為
                    <br />
                    第6条（本サービスの提供の停止等）
                    <br />
                    1. 当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                    <br />
                    (1) 本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
                    <br />
                    (2) 地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
                    <br />
                    (3) コンピュータまたは通信回線等が事故により停止した場合
                    <br />
                    (4) その他、当社が本サービスの提供が困難と判断した場合
                    <br />
                    2.当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
                    <br />
                    第7条（利用制限および登録抹消）
                    <br />
                    1. 当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                    <br />
                    (1) 本規約のいずれかの条項に違反した場合
                    <br />
                    (2) 登録事項に虚偽の事実があることが判明した場合
                    <br />
                    (3) 料金等の支払債務の不履行があった場合
                    <br />
                    (4) 当社からの連絡に対し、一定期間返答がない場合
                    <br />
                    (5) 本サービスについて、最終の利用から一定期間利用がない場合　（注）期間を明記するか？
                    <br />
                    (6) その他、当社が本サービスの利用を適当でないと判断した場合
                    <br />
                    2.当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。
                    <br />
                    第8条（退会）
                    <br />
                    ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
                    <br />
                    第9条（保証の否認および免責事項）
                    <br />
                    1. 当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                    <br />
                    2. 当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
                    <br />
                    3. 当社は、本サービスが全ての情報端末に対応していることを保証するものではなく、本サービスの利用に供する情報端末のＯＳのバージョンアップ等に伴い、本サービスの動作に不具合が生じる可能性があることにつき、ユーザーはあらかじめ了承するものとします。当社は、かかる不具合が生じた場合に当社が行うプログラムの修正等により、当該不具合が解消されることを保証するものではありません。
                    <br />
                    4. ユーザーは、AppStore、GooglePlay等のサービスストアの利用規約および運用方針の変更等に伴い、本サービスの一部又は全部の利用が制限される可能性があることをあらかじめ了承するものとします。
                    <br />
                    5. 前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。
                    <br />
                    6. ユーザーの行為により、第三者から当社が損害賠償等の請求をされた場合には、ユーザーの費用（弁護士費用）と責任で、これを解決するものとします。当社が、当該第三者に対して、損害賠償金を支払った場合には、ユーザーは、当社に対して当該損害賠償金を含む一切の費用（弁護士費用及び逸失利益を含む）を支払うものとします。
                    <br />
                    7. 当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません
                    <br />
                    第10条（サービス内容の変更等）
                    <br />
                    当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
                    <br />
                    第11条（利用規約の変更）
                    <br />
                    1.当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
                    <br />
                    (1) 本規約の変更がユーザーの一般の利益に適合するとき。
                    <br />
                    (2) 本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。
                    <br />
                    2. 当社はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。
                    <br />
                    第12条（個人情報の取扱い）
                    <br />
                    当社は、本サービスの利用によって取得する個人情報については、当社が別途定める「hitobitoプライバシーポリシー」に従い適切に取り扱うものとします。
                    <br />
                    第13条（通知または連絡）
                    <br />
                    ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
                    <br />
                    第1４条（広告の掲載について）
                    <br />
                    ユーザーは、本サービス上にあらゆる広告が含まれる場合があること、当社またはその提携先があらゆる広告を掲載する場合があることを理解しこれを承諾したものとみなします。本サービス上の広告の形態や範囲は、当社によって随時変更されます。
                    <br />
                    第1５条（当社への連絡方法）
                    <br />
                    本サービスに関するユーザーの当社へのご連絡・お問い合わせは、本サービスまたは当社が運営するwebサイト内の適宜の場所に設置するお問い合わせフォームからの送信または当社が別途指定する方法により行うものとします。
                    <br />
                    第1６条（権利義務の譲渡の禁止）
                    <br />
                    ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                    <br />
                    第1７条（準拠法・裁判管轄）
                    <br />
                    1. 本規約の解釈にあたっては、日本法を準拠法とします。
                    <br />
                    2. 本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                    <br />
                    ２０２３年４月1日施行
                    </div>
                </div>
                <div className="term-check">
                    <input id="vertical-form-3" className="form-check-input" type="checkbox" checked={agreeState01} onChange={() => setAgreeState01(!agreeState01)} />
                    <label className="form-check-label" htmlFor="vertical-form-3">上記の利用規約に同意します。</label>
                </div>
                <div className="term-subtit">
                    プライバシーポリシー
                </div>
                <div className="term-wrap">
                    <div className="term-div">
                    サービスプライバシーポリシー
                    <br />
                        　ＫＳ情報システム開発会社（以下、「当社」といいます。）は、本ウェブサイト上で提供するhitobitoのサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めております。
                    <br />
                    第1条（個人情報）
                    <br />
                    「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                    <br />
                    第２条（個人情報の収集方法）
                    <br />
                    当社は、以下の方法で個人情報を取得します。
                    <br />
                    １．	ユーザーから直接、個人情報の提供を受ける方法
                    <br />
                    ２．	第三者から間接的にユーザーの個人情報の提供をうける方法。
                    <br />
                    ３．	ユーザーが当社サービスを利用する際に、自動的に個人情報を記録する方法。
                    <br />
                    当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレスを含む個人情報を提供していただきます。
                    <br />
                    また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。
                    <br />
                    第3条（個人情報を収集・利用する目的）
                    <br />
                    当社が個人情報を収集・利用する目的は、以下のとおりです。                        
                    <br />
                    １．	本サービスの運営およびそれに伴う、ユーザーとの連絡や情報提供。
                    <br />
                    ２．	ユーザーからのお問い合わせに回答するため（個人認証、ユーザー確認を行うことを含む）
                    <br />
                    ３．	ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため
                    <br />
                    ４．	メンテナンス、重要なお知らせなど必要に応じたご連絡のため
                    <br />
                    ５．	利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
                    <br />
                    ６．	ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため
                    <br />
                    ７．	上記の利用目的に付随する目的
                    <br />
                    第4条（利用目的の変更）
                    <br />
                    １．	当社は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。
                    <br />
                    ２．	利用目的の変更を行った場合には、変更後の目的について、当社所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。
                    <br />
                    第5条（個人情報の第三者提供）
                    <br />
                    １．	当社は、次に掲げる場合を除いて、あらかじめ求職者ユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
                    <br />
                    （１）	当社サービスに参加している企業への検索サービス提供の場合には、ユーザーの氏名、生年月日や住所の情報を除外し、ニックネームや性別など当該情報のみでは提供先が特定の個人を識別することができない情報を提供します。
                    <br />
                    （２）	当サービスに参加している企業からの面談依頼に対し、ユーザーが承諾をおこなった企業に対する情報提供。
                    <br />
                    （３）	人の生命、身体または財産の保護のために必要がある場合であって、ユーザーの同意を得ることが困難であるとき。
                    <br />
                    （４）	公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ユーザーの同意を得ることが困難であるとき本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為。
                    <br />
                    （５）	国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき本サービスによって得られた情報を商業的に利用する行為。
                    <br />
                    （６）	予め次の事項を告知あるいは公表し、かつ当社が個人情報保護委員会に届出をしたとき。
                    <br />
                    ①	利用目的に第三者への提供を含むこと
                    <br />
                    ②	第三者に提供されるデータの項目
                    <br />
                    ③	第三者への提供の手段または方法
                    <br />
                    ④	ユーザーの求めに応じて個人情報の第三者への提供を停止すること
                    <br />
                    ⑤	ユーザーの求めを受け付ける方法
                    <br />
                    ２．	前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。
                    <br />
                    （１）	当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                    <br />
                    （２）	合併その他の事由による事業の承継に伴って個人情報が提供される場合。
                    <br />
                    （３）	個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめユーザーに通知し、またはユーザーが容易に知り得る状態に置いた場合。
                    <br />
                    第6条（個人情報の開示）
                    <br />
                    １．	当社は、ユーザー本人から個人情報の開示を求められたときは、ユーザー本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。なお、個人情報の開示に際しては、1件あたり1、000円の手数料を申し受けます。
                    <br />
                    （１）	ユーザーまたは第三者の生命、身体、財産その他の権利利益を害するおそれがある場合
                    <br />
                    （２）	当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合
                    <br />
                    （３）	その他法令に違反することとなる場合
                    <br />
                    ２．	前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。
                    <br />
                    第7条（個人情報の訂正および削除）
                    <br />
                    １．	ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。
                    <br />
                    ２．	当社は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
                    <br />
                    ３．	当社は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。
                    <br />
                    第8条（個人情報の利用停止等）
                    <br />
                    １．	当社は、ユーザーから、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。
                    <br />
                    ２．	前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。
                    <br />
                    ３．	当社は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。
                    <br />
                    ４．	前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。
                    <br />
                    第9条（プライバシーポリシーの変更）
                    <br />
                    １．	本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
                    <br />
                    ２．	当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。
                    <br />
                    第10条（お問い合わせ窓口）
                    <br />
                    本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                    <br />
                    住所：〒103-0003　東京都中央区横山町9-13 イワモトビル2階
                    <br />
                    社名：KS情報システム株式会社
                    <br />
                    担当部署：経営企画室
                    <br />
                    Eメールアドレス：Hitobitoのサポート窓口とは別に個人情報関連の受付窓口の代表アドレスが望ましい。
                    <br />
                    電話番号については、掲示しない（24時間対応できない）
                    </div>
                </div>
                <div className="term-check">
                    <input id="vertical-form-4" className="form-check-input" type="checkbox" checked={agreeState02} onChange={() => setAgreeState02(!agreeState02)} />
                    <label className="form-check-label" htmlFor="vertical-form-4">上記のプライバシーポリシーに同意します。</label>
                </div>
                <div className="find-btn flex flex-col gap-2">
                    <button className="btn btn-primary h-48" onClick={agreeSubmit}>
                        登録
                    </button>
                    <button className="btn btn-outline-primary h-48" onClick={() => navigate("/")}>
                        取消
                    </button>
                </div>
            </div>

            {/* 약관동의 팝업*/}
            <Modal
                show={modalState01}
                onHidden={() => {
                    setModalState01(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">利用規約</div>
                    <div className="modal-subtit">
                        利用規約を確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setModalState01(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={modalState02}
                onHidden={() => {
                    setModalState02(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">プライバシーポリシー</div>
                    <div className="modal-subtit">
                        プライバシーポリシーを確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setModalState02(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default SignupEmployeeTerm;
