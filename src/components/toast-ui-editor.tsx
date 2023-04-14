import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { useEffect } from 'react';

interface Props {
  contentsRef: any;
}

export default function ToastUiEditor({ contentsRef }: Props): JSX.Element {
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
      // TODO: express 내부에 직접 저장하는 방식 혹은 스토리지 서비스 사용해보기, 아니면 그냥 base64 업로드 못하게 막기
      /* hooks: {
        addImageBlobHook: async (blob, callback) => {
          const formData = new FormData();
          formData.append('image', blob);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          callback(data.url, 'alt text');
        },
      }, */
    });
  }, []);

  return (
    <>
      <div ref={contentsRef} id="editor" />
      <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" defer />
    </>
  );
}
