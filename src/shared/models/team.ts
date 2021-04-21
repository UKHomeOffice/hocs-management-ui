import Permission from './permission';

export default interface Team {
    active: boolean;
    displayName: string;
    letterName: string;
    permissions: Permission[];
    type: string;
    unitUUID?: string;
}
