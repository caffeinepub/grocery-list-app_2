import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

actor {
  type ItemId = Nat;
  type Item = {
    itemId : ItemId;
    name : Text;
    quantity : Nat;
    category : Text;
    isChecked : Bool;
  };

  module Item {
    public func compareByItemId(item1 : Item, item2 : Item) : Order.Order {
      Nat.compare(item1.itemId, item2.itemId);
    };
  };

  let itemStore = Map.empty<ItemId, Item>();
  var nextItemId = 0;

  func getNextItemId() : ItemId {
    nextItemId += 1;
    nextItemId - 1;
  };

  public query ({ caller }) func getAllItems() : async [Item] {
    itemStore.values().toArray().sort(Item.compareByItemId);
  };

  public shared ({ caller }) func addItem(name : Text, quantity : Nat, category : Text) : async ItemId {
    let itemId = getNextItemId();
    let item : Item = {
      itemId;
      name;
      quantity;
      category;
      isChecked = false;
    };
    itemStore.add(itemId, item);
    itemId;
  };

  public shared ({ caller }) func markItemChecked(itemId : ItemId, isChecked : Bool) : async () {
    switch (itemStore.get(itemId)) {
      case (null) { Runtime.trap("Item with id " # itemId.toText() # " does not exist.") };
      case (?item) {
        let updatedItem : Item = {
          itemId;
          name = item.name;
          quantity = item.quantity;
          category = item.category;
          isChecked;
        };
        itemStore.add(itemId, updatedItem);
      };
    };
  };

  public shared ({ caller }) func toggleItemChecked(itemId : ItemId) : async () {
    switch (itemStore.get(itemId)) {
      case (null) { Runtime.trap("Item with id " # itemId.toText() # " does not exist.") };
      case (?item) {
        let updatedItem : Item = {
          itemId;
          name = item.name;
          quantity = item.quantity;
          category = item.category;
          isChecked = not item.isChecked;
        };
        itemStore.add(itemId, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteItem(itemId : ItemId) : async () {
    if (not itemStore.containsKey(itemId)) {
      Runtime.trap("Item with id " # itemId.toText() # " does not exist.");
    };
    itemStore.remove(itemId);
  };

  public shared ({ caller }) func clearCheckedItems() : async () {
    let checkedItems = itemStore.filter(
      func(_id, item) {
        item.isChecked;
      }
    );
    checkedItems.keys().forEach(
      func(itemId) {
        itemStore.remove(itemId);
      }
    );
  };

  public shared ({ caller }) func clearAllItems() : async () {
    itemStore.clear();
    nextItemId := 0;
  };
};
