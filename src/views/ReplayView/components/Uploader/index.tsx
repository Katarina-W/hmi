import { Flex, Layout, message, Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import classnames from "classnames";
import { useEffect, useState } from "react";

import styles from "./index.module.less";

export default (props: { onChange: (file: File[]) => void }) => {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    props.onChange(fileList);
  }, [fileList]);

  return (
    <>
      {contextHolder}
      <Layout className={classnames(styles["layout"])}>
        <Layout.Content className={classnames(styles["content"])}>
          <Flex vertical className={classnames(styles["flex-container"])}>
            <h1>Senseview 回放工具</h1>
            <Upload.Dragger
              beforeUpload={(file) => {
                const isHMI = file.name.endsWith(".hmi");
                if (!isHMI) {
                  messageApi.open({
                    type: "error",
                    content: "请选择.hmi文件"
                  });
                }
                return isHMI;
              }}
              customRequest={(e) => {
                setFileList((prev) => {
                  return [...prev, e.file as RcFile];
                });
              }}
              multiple
              showUploadList={false}
              className={classnames(styles["upload"])}
            >
              拖动.hmi文件至此处，或者点击打开选择窗口
            </Upload.Dragger>
            <section className={classnames(styles["tips"])}>
              <p>Senseview 回放工具说明</p>
              <p>1. 按space开始/暂停播放，方向键控制进度</p>
              <p>2. 使用快进将有可能使某些帧丢失，进而导致显示不全</p>
            </section>
          </Flex>
        </Layout.Content>
        <Layout.Footer className={classnames(styles["footer"])}>
          <Flex vertical className={classnames(styles["flex-container"])}>
            <span>Senseauto System.</span>
            <span>
              Copyright ©
              <a href="http://sse.senseauto.com" target="_blank">
                Sensetime
              </a>
            </span>
          </Flex>
        </Layout.Footer>
      </Layout>
    </>
  );
};
