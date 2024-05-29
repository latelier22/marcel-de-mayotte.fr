import React from 'react';
import { TreeItemComponentProps, SimpleTreeItemWrapper } from 'dnd-kit-sortable-tree';

type MinimalTreeItemData = {
  value: string;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => {
  return (
    <SimpleTreeItemWrapper {...props} ref={ref} className="bg-gray-200 text-black p-2 rounded">
      <div>{props.item.value}</div>
    </SimpleTreeItemWrapper>
  );
});

TreeItem.displayName = 'TreeItem';

export default TreeItem;
