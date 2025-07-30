import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Popover, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import './index.less';
type IProps = {
  style?;
  disabled?: boolean;
  value?;
  onChange?;
  action?;
  token?;
  viewFile?;
  downFile?;
  multiple?: boolean;
  maxSize?;
};

const AntdUploadSortjs = (props: IProps) => {
  const {
    token,
    action,
    disabled = false,
    viewFile,
    downFile,
    multiple = true,
    maxSize = 50,
    ...rest
  } = props;
  const [fileListNew, setFileListNew] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  useEffect(() => {
    setFileListNew(props?.value || []);
  }, [props?.value]);
  const removeDuplicatesByUid = (data) => {
    const seen = new Set();
    return data.filter((item) => {
      if (!item.uid) return true; // 如果没有 uid，不进行去重判断
      if (seen.has(item.uid)) {
        return false;
      } else {
        seen.add(item.uid);
        return true;
      }
    });
  };
  const onChangeFile = ({ file, fileList }) => {
    // console.log(file, fileList)
    const filterArr = removeDuplicatesByUid([
      ...(props?.value || []),
      ...fileList,
    ]);
    setFileListNew([...filterArr]);
    setIsLoading(true);
    if (file.response) {
      if (file.response.code === 200) {
        if (fileList.filter((i) => i.status === 'uploading').length === 0) {
          const fileResult = fileList.map((i) => {
            if (i.response) {
              return {
                ...i,
                ...i?.response.data,
              };
            }
            return {
              ...i,
            };
          });
          props?.onChange(
            removeDuplicatesByUid([...(props?.value || []), ...fileResult]),
          );
          setIsLoading(false);
        }
      } else {
        message.error(`${file.response.message}`);
        setIsLoading(false);
      }
    }
  };

  const onRemoveFile = (file) => {
    const newFile = fileListNew.filter((item) => item.path !== file.path);
    setFileListNew(newFile);
    props?.onChange(newFile);
  };

  const beforeUpload = (file) => {
    // 限制50M
    const isFile50M = file.size / 1024 / 1024 > maxSize;
    if (isFile50M) {
      message.warning(`${file.name}大小超出${maxSize}M，请修改后重新上传`);
      return Upload.LIST_IGNORE;
    }
    return !isFile50M;
  };

  return (
    <div className="UploadRender">
      <Upload
        fileList={fileListNew}
        {...rest}
        showUploadList={false}
        action={action}
        headers={{ token: token }}
        beforeUpload={beforeUpload}
        onChange={onChangeFile}
        multiple={multiple}
        accept={
          '.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.pdf,.mp3,.rar,.zip,.doc,.xls,.csv,.ppt,.pptx,.txt'
        }
      >
        {!disabled && (
          <Button
            type="primary"
            loading={isLoading}
            disabled={isLoading}
            icon={<UploadOutlined />}
          >
            上传
          </Button>
        )}
      </Upload>

      <ReactSortable
        list={fileListNew}
        disabled={disabled}
        animation={150}
        onEnd={() => {}}
        setList={(list) => {
          if (list.length > 0) {
            setFileListNew(list);
            props?.onChange && props?.onChange(list);
          }
        }}
      >
        {fileListNew.length > 0 &&
          fileListNew.map((item, idx) => (
            <div
              className={disabled ? 'upload-content' : 'upload-content border'}
              key={idx}
              style={{}}
            >
              <div className="left">
                {item.status === 'uploading' ? (
                  <div>
                    <LoadingOutlined style={{ fontSize: '20px' }} />
                  </div>
                ) : (
                  <div className="icon"></div>
                )}
                <Popover content={item.accName}>
                  <div className="accNames"> {item.accName || item.name}</div>
                </Popover>
              </div>
              <div style={{ flex: 'none' }}>
                {!disabled && (
                  <DeleteOutlined
                    className="delete"
                    onClick={() => onRemoveFile(item)}
                  />
                )}
                {disabled && (
                  <EyeOutlined className="eye" onClick={() => viewFile(item)} />
                )}
                {disabled && (
                  <DownloadOutlined
                    className="down"
                    onClick={() => downFile(item)}
                  />
                )}
              </div>
            </div>
          ))}
      </ReactSortable>
      {/* 正在上传的 */}
      {/* {tempFile.map((item, index) => {
        return (
          <div className="upload-content border" key={index}>
            <div className="left">
              {item.status === 'done' && <div className="icon"></div>}
              {item.status === 'uploading' && (
                <div>
                  <LoadingOutlined style={{ fontSize: '20px' }} />
                </div>
              )}
              <div className="accName"> {item.name}</div>
            </div>
          </div>
        )
      })} */}
    </div>
  );
};
export default AntdUploadSortjs;
