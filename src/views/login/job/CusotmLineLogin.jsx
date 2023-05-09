import React, { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import LineIcon from "@/assets/images/line-icon.svg";


const CustomLineLogin = ({ setSnsBody }) => {
  const [displayName, setDisplayName] = useState('');
  const [liffData, setLiffData] = useState()
  const { error, isLoggedIn, isReady, liff } = useLiff();``

  useEffect(() => {
    if (!isLoggedIn) return;

    (async () => {
      const profile = await liff.getProfile();
      setDisplayName(profile.displayName);
      setSnsBody({
        loginType: 'line',
        OAuthToken: {
          access_token: liff.getAccessToken() ? liff.getAccessToken() : null,
          token_type: null,
          refresh_token: null,
          expires_in: null,
          scope: null,
          id_token: liff.getIDToken() ? liff.getIDToken() : null,
          refresh_token_expires_in: null,
        }
      })
    })();
  }, [liff, isLoggedIn]);

  useEffect(() => {
    if (liffData) {
      /*console.log(liffData)
      console.log('getAId : ' + liffData.getAId())
      console.log('getAccessToken : ' + liffData.getAccessToken())
      // console.log('getAdvertisingId : ' + liffData.getAdvertisingId())
      console.log('getContext : ' + liffData.getContext())
      console.log('getDecodedIDToken : ' + liffData.getDecodedIDToken())
      console.log('getFriendship : ' + liffData.getFriendship())
      console.log('getIDToken : ' + liffData.getIDToken())
      console.log('getIsVideoAutoPlay : ' + liffData.getIsVideoAutoPlay())
      console.log('getLineVersion : ' + liffData.getLineVersion())
      console.log('getOS : ' + liffData.getOS())
      console.log('getProfile : ' + liffData.getProfile())
      console.log('getProfilePlus : ' + liffData.getProfilePlus())

      console.log('getVersion : ' + liffData.getVersion())
      console.log('getContext : ' + JSON.stringify(liffData.getContext(), null, 2))*/

    }
  }, [liffData])

  return (
    <button className="btn-line flex flex-center" onClick={liff.login}>
      <div className="button-wrap flex items-center gap-2">
        <img src={LineIcon} alt="" />
        Lineログイン
      </div>
    </button>
  );
};

export default CustomLineLogin;
