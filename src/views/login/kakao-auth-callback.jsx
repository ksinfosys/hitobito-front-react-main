import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userInfo } from "../../stores/user-info";
import { userCount } from "../../stores/search-count";
import { useRecoilState } from "recoil";
import { setCookie } from "../../utils/cookie";
import axios from "axios";

const KakaoAuthCallback = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const kakao_code = location.search.split('=')[1];

	// 에러메시지 케이스 : S
  const [oAuthTokenFail, setOAuthTokenFail] = useState(false);
  const [socialIdFail, setSocialIdFail] = useState(false);
  const [socialFail, setSocialFail] = useState(false);
  const [secessionFail, setSecessionFail] = useState(false);
  const [reportFail, setReportFail] = useState(false);
  const [stopFail, setStopFail] = useState(false);
  // 에러메시지 케이스 : E

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

	const getKakaoToken = () => {
		axios({
			method: 'post',
			url: 'https://kauth.kakao.com/oauth/token',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			params: {
				grant_type: 'authorization_code',
				client_id: 'ef608f25820e6512a7b7a38c4d94135c',
				redirect_uri: `https://${window.location.hostname}/kakao-auth-callback`,
				code: kakao_code
			}
		}).then(res => {
			console.log(res);
			snsLogin(res.data, 'kakao')
		}).catch(err => {
			console.log(err);
		})
	}
   
	useEffect(() => {
		if (!location.search) return;
		getKakaoToken();
	}, []);

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
					navigate('/');
				} else if (res.data.resultCode === '212') {
					setOAuthTokenFail(true)
				} else if (res.data.resultCode === '213') {
					setSocialIdFail(true)
				} else if (res.data.resultCode === '207') {
					setSocialFail(true)
				} else if (res.data.resultCode === '220') {
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
}

export default KakaoAuthCallback