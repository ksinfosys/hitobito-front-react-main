import { createElement, createRef, useEffect } from "react";
import { createPortal } from "react-dom";
import dom from "@left4code/tw-starter/dist/js/dom";
import "@left4code/tw-starter/dist/js/modal";
import PropTypes from "prop-types";
import classnames from "classnames";
import { useNavigate } from 'react-router-dom';

const init = (el, props) => {

  const modal = tailwind.Modal.getOrCreateInstance(el);
  if (props.show) {
    modal.show();
  } else {
    modal.hide();
  }

  if (el["__initiated"] === undefined) {
    el["__initiated"] = true;

    el.addEventListener("show.tw.modal", () => {
      props.onShow();
    });

    el.addEventListener("shown.tw.modal", () => {
      props.onShown();
    });

    el.addEventListener("hide.tw.modal", () => {
      props.onHide();
    });

    el.addEventListener("hidden.tw.modal", () => {
      props.onHidden();
    });
  }
};
/**
 * 스크롤을 방지하고 현재 위치를 반환한다.
 * @returns {number} 현재 스크롤 위치
 */
export const preventScroll = () => {

  const currentScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
  document.body.style.overflowY = 'scroll';
  return currentScrollY;
};

/**
 * 스크롤을 허용하고, 스크롤 방지 함수에서 반환된 위치로 이동한다.
 * @param prevScrollY 스크롤 방지 함수에서 반환된 스크롤 위치
 */
export const allowScroll = (prevScrollY) => {
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  document.body.style.overflowY = '';
  document.body.style.padding = '';
  window.scrollTo(0, prevScrollY);
};

// Modal wrapper
function Modal(props) {
  const modalRef = createRef();

  useEffect(() => {
    props.getRef(modalRef.current);
    dom(modalRef.current).attr(
      "id",
      "_" + Math.random().toString(36).substr(2, 9)
    );

    init(modalRef.current, props);

    if(props.show){
      const prevScrollY = preventScroll();
      return () => {
        allowScroll(prevScrollY);
      };
    }
  }, [props.show]);

  return createPortal(
    createElement(
      "div",
      {
        className: classnames({
          modal: true,
          [props.className]: true,
          "modal-slide-over": props.slideOver,
          'scrollHidden': props.show
        }),
        tabIndex: "-1",
        "aria-hidden": "true",
        "data-tw-backdrop": props.backdrop,
        ref: modalRef,
        onClick() {
          if(props.naviSrc) {
            window.location.assign(props.naviSrc)
          } else {
            //console.log(222)
          }
        }
      },
      createElement(
        "div",
        {
          className: `modal-dialog ${props.size}`,
        },
        createElement(
          "div",
          {
            className: "modal-content",
          },
          typeof props.children === "function"
            ? props.children({
                dismiss: () => {
                  tailwind.Modal.getOrCreateInstance(modalRef.current).hide();
                },
              })
            : props.children
        )
      )
    ),
    dom("body")[0]
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  size: PropTypes.string,
  backdrop: PropTypes.string,
  slideOver: PropTypes.bool,
  getRef: PropTypes.func,
  onShow: PropTypes.func,
  onShown: PropTypes.func,
  onHide: PropTypes.func,
  onHidden: PropTypes.func,
};

Modal.defaultProps = {
  show: false,
  size: "",
  backdrop: "",
  slideOver: false,
  getRef: () => {},
  onShow: () => {},
  onShown: () => {},
  onHide: () => {},
  onHidden: () => {},
};

// Modal header
function ModalHeader(props) {
  return createElement(
    "div",
    {
      className: `modal-header ${props.className}`,
    },
    props.children
  );
}

ModalHeader.propTypes = {
  className: PropTypes.string,
};

ModalHeader.defaultProps = {
  className: "",
};

// Modal body
function ModalBody(props) {
  return createElement(
    "div",
    {
      className: `modal-body ${props.className}`,
    },
    props.children
  );
}

ModalBody.propTypes = {
  className: PropTypes.string,
};

ModalBody.defaultProps = {
  className: "",
};

// Modal footer
function ModalFooter(props) {
  return createElement(
    "div",
    {
      className: `modal-footer ${props.className}`,
    },
    props.children
  );
}

ModalFooter.propTypes = {
  className: PropTypes.string,
};

ModalFooter.defaultProps = {
  className: "",
};

export { Modal, ModalHeader, ModalBody, ModalFooter };
