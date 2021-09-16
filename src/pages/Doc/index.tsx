import { defineComponent, onMounted, PropType, ref } from 'vue';
import Editor, { HeadList } from 'md-editor-v3';
import { Theme } from '../../App';
import axios from 'axios';
import 'md-editor-v3/lib/style.css';
import './index.less';
import { version } from '../../../package.json';
import Catalog from '@/components/Catalog';
import { Affix } from 'ant-design-vue';

export default defineComponent({
  props: {
    theme: String as PropType<Theme>
  },
  setup(props) {
    const mdText = ref();
    const catalogList = ref<Array<HeadList>>([]);

    onMounted(() => {
      axios
        .get('/doc.md')
        .then(({ data }) => {
          mdText.value = (data as string).replace(/\$\{EDITOR_VERSION\}/g, version);
        })
        .catch((e) => {
          console.log(e);

          mdText.value = '文档读取失败！';
        });
    });
    return () => (
      <div class="container">
        <div class="doc">
          <div class="content">
            <Editor
              theme={props.theme}
              modelValue={mdText.value}
              previewOnly
              showCodeRowNumber
              previewTheme="vuepress"
              onGetCatalog={(arr) => {
                catalogList.value = arr;
              }}
            />
          </div>
          <div class="catalog">
            <Affix offsetTop={16}>
              <Catalog heads={catalogList.value} />
            </Affix>
          </div>
        </div>
      </div>
    );
  }
});