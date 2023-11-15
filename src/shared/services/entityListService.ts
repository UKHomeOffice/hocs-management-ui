import axios from 'axios';
import EntityListItem from 'shared/models/entityListItem';

export const getListItems = (listName: string) => new Promise<EntityListItem[]>((resolve, reject) => axios
    .get(`/api/entity/list/${listName}`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const createListItem = (item: EntityListItem, listName: string) => new Promise((resolve, reject) => axios
    .post(`/api/entity/list/${listName}`, item)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const getItemDetails = (itemUUID: string) => new Promise<EntityListItem>((resolve, reject) => axios
    .get(`/api/entity/${itemUUID}`)
    .then(response => resolve(response.data))
    .catch(reason => reject(reason))
);

export const updateListItem = (item: EntityListItem, listName: string) => new Promise((resolve, reject) => axios
    .post(`/api/entity/list/update/${listName}`, item)
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);

export const deleteListItem = (uuid: string, listName: string) => new Promise((resolve, reject) => axios
    .delete(`/api/entity/list/${listName}`, { data: { entityUUID: uuid } })
    .then(() => resolve(null))
    .catch(reason => reject(reason))
);
