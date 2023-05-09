import { createElement, createRef, useEffect } from "react";
import { createPortal } from "react-dom";
import dom from "@left4code/tw-starter/dist/js/dom";
import "@left4code/tw-starter/dist/js/modal";
import PropTypes from "prop-types";
import classnames from "classnames";

const init = (el, props) => {
  const messageReceptionModal = tailwind.Modal.getOrCreateInstance(el);
  if (props.show) {
    messageReceptionModal.show();
  } else {
    messageReceptionModal.hide();
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

// Modal wrapper
function MessageReceptionModal(props) {
  const messageReceptionModalRef = createRef();

  useEffect(() => {
    props.getRef(messageReceptionModalRef.current);
    dom(messageReceptionModalRef.current).attr(
      "id",
      "_" + Math.random().toString(36).substr(2, 9)
    );
    init(messageReceptionModalRef.current, props);
  }, [props.show]);

  return createPortal(
    createElement(
      "div",
      {
        className: classnames({
          modal: true,
          [props.className]: true,
          "modal-slide-over": props.slideOver,
        }),
        tabIndex: "-1",
        "aria-hidden": "true",
        "data-tw-backdrop": props.backdrop,
        ref: messageReceptionModalRef,
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
                  tailwind.Modal.getOrCreateInstance(messageReceptionModalRef.current).hide();
                },
              })
            : props.children
        )
      )
    ),
    dom("body")[0]
  );
}

MessageReceptionModal.propTypes = {
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

MessageReceptionModal.defaultProps = {
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
function MessageReceptionModalHeader(props) {
  return createElement(
    "div",
    {
      className: `modal-header ${props.className}`,
    },
    props.children
  );
}

MessageReceptionModalHeader.propTypes = {
  className: PropTypes.string,
};

MessageReceptionModalHeader.defaultProps = {
  className: "",
};

// Modal body
function MessageReceptionModalBody(props) {
  return createElement(
    "div",
    {
      className: `modal-body ${props.className}`,
    },
    props.children
  );
}

MessageReceptionModalBody.propTypes = {
  className: PropTypes.string,
};

MessageReceptionModalBody.defaultProps = {
  className: "",
};

// Modal footer
function MessageReceptionModalFooter(props) {
  return createElement(
    "div",
    {
      className: `modal-footer ${props.className}`,
    },
    props.children
  );
}

MessageReceptionModalFooter.propTypes = {
  className: PropTypes.string,
};

MessageReceptionModalFooter.defaultProps = {
  className: "",
};

export { MessageReceptionModal, MessageReceptionModalHeader, MessageReceptionModalBody, MessageReceptionModalFooter };
