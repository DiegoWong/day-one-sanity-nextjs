export function flatDataToTree(data: any) {
    return getTreeFromFlatData({
        flatData: data.map((item: any) => ({
            ...item,
            // if parent: undefined, the tree won't be constructed
            parent: item.parent || null,
        })),
        getKey: (item) => item._key,
        getParentKey: (item) => item.parent,
        // without rootKey, the tree won't be constructed
        rootKey: null as any,
    })
}

const getTreeFromFlatData = ({
    flatData,
    getKey = node => node.id,
    getParentKey = node => node.parentId,
    rootKey = '0'
}) => {
    if (!flatData) {
        return [];
    }
    const childrenToParents = {};
    for (const child of flatData) {
        const parentKey = getParentKey(child);
        if (parentKey in childrenToParents) {
            childrenToParents[parentKey].push(child);
        } else {
            childrenToParents[parentKey] = [child];
        }
    }
    if (!(rootKey in childrenToParents)) {
        return [];
    }
    const trav = parent => {
        const parentKey = getKey(parent);
        if (parentKey in childrenToParents) {
            return {
                ...parent,
                children: childrenToParents[parentKey].map(child => trav(child))
            };
        }
        return {
            ...parent
        };
    };
    return childrenToParents[rootKey].map(child => trav(child));
};
