import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileDoneOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Popover, Upload } from 'antd';
import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import './index.less';
type IProps = {
  multiply?: boolean; // 单&多选
  style?;
  disabled?: boolean;
  value?;
  onChange?;
};

const AntdUpload = (props: IProps) => {
  const [fileList, setFileList] = useState<any>([
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33,
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'done',
    },
  ]);

  return (
    <div className="UploadRender">
      <Upload
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      >
        <Button type="primary" icon={<UploadOutlined />}>
          上传
        </Button>
      </Upload>
      <ReactSortable list={fileList} setList={setFileList}>
        {fileList.map((item) => (
          <div className="upload-content" key={item.uid}>
            <div className="left">
              <div className="icon">
                {item.status === 'uploading' && (
                  <LoadingOutlined style={{ fontSize: '20px' }} />
                )}
                {item.status === 'done' && (
                  <FileDoneOutlined style={{ fontSize: '20px' }} />
                )}
              </div>
              <Popover content={item.name}>
                <div className="accName"> {item.name}</div>
              </Popover>
            </div>
            <div style={{ flex: 'none' }}>
              <DeleteOutlined className="delete" />
              <EyeOutlined className="eye" />
              <DownloadOutlined className="down" />
            </div>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};
export default AntdUpload;
