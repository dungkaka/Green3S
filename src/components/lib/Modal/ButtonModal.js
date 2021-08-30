import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";
import ModalAlert from "./ModalAlert";

const ButtonModal = ({ title, content, onOk, onCancel, style, children, disabled = false }) => {
  const modalAlertRef = useRef();

  return (
    <TouchableOpacity style={style} disabled={disabled} onPress={() => modalAlertRef.current.open()}>
      {children}
      <ModalAlert modalAlertRef={modalAlertRef} title={title} content={content} onOk={onOk} onCancel={onCancel} />
    </TouchableOpacity>
  );
};

export default React.memo(ButtonModal);
