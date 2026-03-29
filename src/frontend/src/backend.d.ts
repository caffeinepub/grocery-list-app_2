import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ItemId = bigint;
export interface Item {
    itemId: ItemId;
    isChecked: boolean;
    name: string;
    quantity: bigint;
    category: string;
}
export interface backendInterface {
    addItem(name: string, quantity: bigint, category: string): Promise<ItemId>;
    clearAllItems(): Promise<void>;
    clearCheckedItems(): Promise<void>;
    deleteItem(itemId: ItemId): Promise<void>;
    getAllItems(): Promise<Array<Item>>;
    markItemChecked(itemId: ItemId, isChecked: boolean): Promise<void>;
    toggleItemChecked(itemId: ItemId): Promise<void>;
}
