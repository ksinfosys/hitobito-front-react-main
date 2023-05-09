import React, { useEffect } from "react";
import { MutatingDots } from "react-loader-spinner";

const Loading = (props) => {
  const check = props.loading == null ? false : props.loading;
  return check ? (
    <div className="flex items-center justify-center fixed w-full h-full inset-x-0 z-50 bg-black bg-opacity-10">
      <MutatingDots
        height="100"
        width="100"
        color="#3686FF"
        secondaryColor="#3686FF"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  ) : (
    <></>
  );
};

export default Loading;
