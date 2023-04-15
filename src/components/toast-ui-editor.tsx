import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { useEffect } from 'react';
import { uploadApi } from '../apis/upload';

interface Props {
  contentRef: any;
}

const onUploadImage = async (blob: Blob | File, callback: any) => {
  const formData = new FormData();
  formData.append('file', blob);
  const response = await uploadApi({ formData });
  callback(`${process.env.API_URL}${response.data.url}`, 'image');
};

export default function ToastUiEditor({ contentRef }: Props): JSX.Element {
  useEffect(() => {
    new Editor({
      el: window.document.querySelector('#editor') as HTMLElement,
      previewStyle: 'vertical',
      height: '600px',
      initialEditType: 'wysiwyg',
      language: 'ko',
      usageStatistics: false,
      hideModeSwitch: true,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['image', 'link'],
      ],

      hooks: {
        addImageBlobHook: onUploadImage,
      },
    });
  }, []);

  return (
    <>
      <div ref={contentRef} id="editor" />
      <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" defer />
    </>
  );
}
