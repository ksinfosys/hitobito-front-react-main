import { useRecoilState } from "recoil";
import { userInfo } from "../../../stores/user-info";
import AppleIcon from "@/assets/images/apple_login.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import { useGoogleLogin } from "@react-oauth/google";
import AppleLogin from 'react-apple-login'
import { liff } from "@line/liff";
import {
  Modal,
  ModalBody,
} from "@/base-components";

import { useEffect, useState } from "react";
import KakaoLogin from "react-kakao-login";
import axios from "axios";
import CustomLineLogin from "./CusotmLineLogin";
import serviceFetch from "../../../../util/ServiceFetch";
import { delCookie, setCookie } from "../../../utils/cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { userCount } from "../../../stores/search-count";
import { isMobile } from "react-device-detect";
import jwt_decode from "jwt-decode";

const UserLogin = () => {
	// 에러메시지 케이스 : S
	const [oAuthTokenFail, setOAuthTokenFail] = useState(false);
	const [socialIdFail, setSocialIdFail] = useState(false);
	const [socialFail, setSocialFail] = useState(false);
	const [secessionFail, setSecessionFail] = useState(false);
	const [reportFail, setReportFail] = useState(false);
	const [stopFail, setStopFail] = useState(false);
	// 에러메시지 케이스 : E

	const navigate = useNavigate()
	const location = useLocation();
	//const kakao_code = location.search.split('=')[1];
	const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
	const [userCountV, setUserCountV] = useRecoilState(userCount);
	const [snsBody, setSnsBody] = useState({
		loginType: null,
		OAuthToken: {
			access_token: null,
			token_type: null,
			refresh_token: null,
			expires_in: null,
			scope: null,
			id_token: null,
			refresh_token_expires_in: null
		}
	})
	const [snsKey, setSnsKey] = useState({
		google: {
			client_id: '994073566161-uheufnfp50scmu1lquhkg0mdbpr7ip56.apps.googleusercontent.com',
			client_secret: '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'
		},
		kakao: {
			app_key: 'ef608f25820e6512a7b7a38c4d94135c'
		},
		line: {
			client_id: '1657832968',
			client_secret: '627d99da809d143545a2b26f694ff47e',
			redirect_url: 'https://hitobito-net.com/api/auth/line/callback',
			scope: 'profile%20openid%20email',
			state: '12345abcde'
		}, 
		apple: {
			client_id: 'hitobito.ksinfo.com',
			redirect_url: `https://hitobito-net.com`,
		}
	})

	const snsLogin = (response, loginType) => {
		console.log(loginType)
		console.log(response)
		setSnsBody({
			loginType: loginType,
			OAuthToken: {
				access_token: response.access_token ? response.access_token : null,
				token_type: response.token_type ? response.token_type : null,
				refresh_token: response.refresh_token ? response.refresh_token : null,
				expires_in: response.expires_in ? response.expires_in : null,
				scope: response.scope ? response.scope : null,
				id_token: response.id_token ? response.id_token : null,
				refresh_token_expires_in: response.refresh_token_expires_in ? response.refresh_token_expires_in : null,
			}
		})
	}

	const googleLogin = useGoogleLogin({
		onSuccess: res => snsLogin(res, 'google'),
	});

	useEffect(() => {
		console.log(snsBody)
		if (snsBody.loginType) {
			axios.post('/api/auth/login', snsBody, {
				withCredentials: true,
				headers: {
					'Content-type': 'application/json'
				}
			})
			.then(async (res) => {
				console.log(res)
				if (res.data.resultCode === '200') {
					if (res.data.result.firstLoginFlag) {
						navigate('/signup-em-term')
					}
					await setCookie("accessToken", res.headers.accesstoken, 1);
					await setCookie("lastLoginTime", res.headers.lastlogintime, 1);
					setUserInfoV(prevValue => ({
						...prevValue,
						userType: 1,
						userNickName: res.data.result.nickname,
						historyBalance: res.data.result.historyBalance
					}));
					setUserCountV(prev => ({
						...prev,
						interviewCount: res.data.result.interviewCount
					}))
					localStorage.clear();
					delCookie("LIFF_STORE:expires:1657832968-ZeGx3gbz");
				} else if (res.data.resultCode === '212') {
					setOAuthTokenFail(true)
				} else if (res.data.resultCode === '213') {
					setSocialIdFail(true)
				} else if (res.data.resultCode === '207') {
					setSocialFail(true)
				} else if (res.data.resultCode === '220') {
					delCookie("LIFF_STORE:expires:1657832968-ZeGx3gbz");
					setSecessionFail(true)
				} else if (res.data.resultCode === '218') {
					setReportFail(true)
				} else if (res.data.resultCode === '231') {
					setStopFail(true)
				} else {
					return
				}
			}).catch(e => console.log(e))
		}
	}, [snsBody])

	// 카카오 로그인 버튼 클릭
	const handleKakaoLogin = () => {
		localStorage.setItem('clickSnsType', 'kakao');
		window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${snsKey.kakao.app_key}&response_type=code&redirect_uri=https://${window.location.hostname}`;
	}

	// 카카오 로그인 콜백
	const getKakaoToken = (kakao_code) => {
		axios({
			method: 'post',
			url: 'https://kauth.kakao.com/oauth/token',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			params: {
				grant_type: 'authorization_code',
				client_id: snsKey.kakao.app_key,
				redirect_uri: `https://${window.location.hostname}`,
				code: kakao_code
			}
		}).then(res => {
			console.log("getKakaoToken.res")
			console.log(res);
			console.log(res.data)
			snsLogin(res.data, 'kakao')
		}).catch(err => {
			console.log(err);
		})
	}

	// 애플 정보
	var array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	AppleID.auth.init({
		clientId : 'hitobito.ksinfo.com',
		scope : 'email',
		redirectURI: 'https://hitobito-net.com',
		state : toString(array[0]),
		usePopup: false
	});

	// 애플 로그인 버튼 클릭
	const handleAppleLogin = () => {
		//AppleID.auth.signIn();
		localStorage.setItem('clickSnsType', 'apple');
		window.location.href = `https://appleid.apple.com/auth/authorize?response_type=code&response_mode=query&client_id=${snsKey.apple.client_id}&redirect_uri=${snsKey.apple.redirect_url}`;
	}

	useEffect(() => {
		if (!location.search) return;
		const code = location.search.split('=')[1];
		if (localStorage.getItem('clickSnsType') === 'kakao') {
			getKakaoToken(code);
		} else if (localStorage.getItem('clickSnsType') === 'apple') {
			setSnsBody({
				loginType: 'apple',
				OAuthToken: {
					access_token: null,
					token_type: "web",
					refresh_token: null,
					expires_in: null,
					scope: null,
					id_token: code,
					refresh_token_expires_in: null,
				}
			})
		}
	}, []);

	return <div className="btn-wrap">

		<CustomLineLogin setSnsBody={setSnsBody} />

		<button className="mobile_none btn-google flex flex-center" onClick={googleLogin}>
		<div className="button-wrap flex items-center gap-2">
			<img src={GoogleIcon} alt="" />
			Googleログイン
		</div>
		</button>

		<button className="btn-kakao flex flex-center" onClick={handleKakaoLogin}>
			<div className="button-wrap flex items-center gap-2">
				<img src={KakaoIcon} alt="" />
				Kakaoログイン
			</div>
		</button>

		<button className="btn-apple flex flex-center" onClick={handleAppleLogin}>
			<div className="button-wrap flex items-center gap-2">
				<img src={AppleIcon} alt="" />
				<div className="mt-1">Appleログイン</div>
			</div>
		</button>

		{/* OAuth Token Error  */}
		<Modal
		show={oAuthTokenFail}
		onHidden={() => {
			setOAuthTokenFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">Logout Error</div>
			<div className="modal-subtit">
			OauthTokenを探しませんでした。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setOAuthTokenFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

		{/* Social Id Error */}
		<Modal
		show={socialIdFail}
		onHidden={() => {
			setSocialIdFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">Logout Error</div>
			<div className="modal-subtit">
			ソーシャルIDを探しませんでした。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setSocialIdFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

		{/* Sociaal Error */}
		<Modal
		show={socialFail}
		onHidden={() => {
			setSocialFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">ソーシャル連動に失敗しました。</div>
			<div className="modal-subtit">
			もう一度お試しください。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setSocialFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

		{/* secession Error */}
		<Modal
		show={secessionFail}
		onHidden={() => {
			setSecessionFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">既に退会した会員です。</div>
			<div className="modal-subtit">
			ログインするには再登録してください。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setSecessionFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

		{/* report Error */}
		<Modal
		show={reportFail}
		onHidden={() => {
			setReportFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">利用制裁中のユーザーです。</div>
			<div className="modal-subtit">
			管理者にお問い合わせください。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setReportFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

		{/* stop fail */}
		<Modal
		show={stopFail}
		onHidden={() => {
			setStopFail(false);
		}}
		>
		<ModalBody className="p-10 text-center">
			<div className="modal-tit">利用停止中です。</div>
			<div className="modal-subtit">
			メニューの選択に制限があります。いつでも利用再開できます。
			</div>
			<div className="flex flex-end gap-3">
			<a
				href="#"
				className="btn btn-business"
				onClick={() => {
				setStopFail(false);
				}}
			>
				確認
			</a>
			</div>
		</ModalBody>
		</Modal>

	</div>
}

export default UserLogin
