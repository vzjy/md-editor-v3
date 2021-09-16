import { Anchor } from 'ant-design-vue';
import { computed, defineComponent, PropType } from 'vue';

import Recursive, { Head, TocItem } from './Recursive';

const Topicfy = defineComponent({
  props: {
    // 解析得到的标题列表
    heads: {
      type: Array as PropType<Array<Head>>
    }
  },
  setup(props) {
    const topics = computed(() => {
      const tocItems: TocItem[] = [];

      // 标题计数器
      let count = 0;

      const add = (text: string, level: number) => {
        count++;

        const item = { anchor: `heading-${count}`, level, text };

        if (tocItems.length === 0) {
          // 第一个 item 直接 push
          tocItems.push(item);
        } else {
          let lastItem = tocItems[tocItems.length - 1]; // 最后一个 item

          if (item.level > lastItem.level) {
            // item 是 lastItem 的 children
            for (let i = lastItem.level + 1; i <= 6; i++) {
              const { children } = lastItem;
              if (!children) {
                // 如果 children 不存在
                lastItem.children = [item];
                break;
              }

              lastItem = children[children.length - 1]; // 重置 lastItem 为 children 的最后一个 item

              if (item.level <= lastItem.level) {
                // item level 小于或等于 lastItem level 都视为与 children 同级
                children.push(item);
                break;
              }
            }
          } else {
            // 置于最顶级
            tocItems.push(item);
          }
        }
      };

      props.heads?.forEach((item) => {
        add(item.text, item.level);
      });
      return tocItems;
    });

    return () => (
      <Anchor affix={false} showInkInFixed={true}>
        {topics.value.map((item) => (
          <Recursive key={item.anchor} tocItem={item} />
        ))}
      </Anchor>
    );
  }
});

export default Topicfy;