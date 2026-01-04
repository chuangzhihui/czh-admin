import {Modal, ModalProps} from "antd";
import React from "react";
interface CZHModalProps extends ModalProps {

}
const CZHModal = (props: CZHModalProps) => {


    return(
        <Modal
            centered={true}
            destroyOnHidden={true}
            footer={null}
            closeIcon={(<p className='iconfont icon-guanbi'></p>)}
            wrapClassName={"customerModal"}
            {...props}
        >
            {props.children}
        </Modal>
    );
}

export default CZHModal;