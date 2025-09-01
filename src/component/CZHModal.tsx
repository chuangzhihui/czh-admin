import React from 'react';
import {Modal, ModalProps} from 'antd'
interface CZHModalProps extends ModalProps {

}
const CZHModal = (props: CZHModalProps) => {
    return(
        <Modal
            centered={true}
            destroyOnClose={true}
            footer={null}
            closeIcon={(<p className='iconfont icon-guanbi'></p>)}
            wrapClassName={"customerModal"}
            {...props}
        ></Modal>
    );
}
export default CZHModal;
