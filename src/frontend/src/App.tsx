import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  CheckCircle2,
  Coffee,
  Cookie,
  Fish,
  Home,
  Leaf,
  Lightbulb,
  ListTodo,
  Milk,
  Plus,
  Sandwich,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Item } from "./backend";
import {
  useAddItem,
  useClearAllItems,
  useClearCheckedItems,
  useDeleteItem,
  useGetAllItems,
  useToggleItem,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

const CATEGORIES = [
  "Fresh Produce",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Snacks",
  "Beverages",
  "Bakery",
  "Household",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Fresh Produce": "bg-emerald-100 text-emerald-800",
  "Dairy & Eggs": "bg-yellow-100 text-yellow-800",
  "Meat & Seafood": "bg-rose-100 text-rose-800",
  Snacks: "bg-orange-100 text-orange-800",
  Beverages: "bg-blue-100 text-blue-800",
  Bakery: "bg-amber-100 text-amber-800",
  Household: "bg-purple-100 text-purple-800",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Fresh Produce": <Leaf className="w-4 h-4" />,
  "Dairy & Eggs": <Milk className="w-4 h-4" />,
  "Meat & Seafood": <Fish className="w-4 h-4" />,
  Snacks: <Cookie className="w-4 h-4" />,
  Beverages: <Coffee className="w-4 h-4" />,
  Bakery: <Sandwich className="w-4 h-4" />,
  Household: <Home className="w-4 h-4" />,
};

type FilterTab = "all" | "pending" | "checked";

function GroceryApp() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState("Fresh Produce");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const { data: items = [], isLoading } = useGetAllItems();
  const addItem = useAddItem();
  const toggleItem = useToggleItem();
  const deleteItem = useDeleteItem();
  const clearChecked = useClearCheckedItems();
  const clearAll = useClearAllItems();

  const handleAddItem = async () => {
    const name = itemName.trim();
    if (!name) return;
    const qty = Math.max(1, Number.parseInt(quantity) || 1);
    await addItem.mutateAsync(
      { name, quantity: BigInt(qty), category },
      {
        onSuccess: () => {
          toast.success(`"${name}" added to list!`);
          setItemName("");
          setQuantity("1");
        },
        onError: () => toast.error("Failed to add item"),
      },
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "pending") return !item.isChecked;
    if (filter === "checked") return item.isChecked;
    return true;
  });

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const catItems = filteredItems.filter((i) => i.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    },
    {} as Record<string, Item[]>,
  );

  const checkedCount = items.filter((i) => i.isChecked).length;
  const pendingCount = items.filter((i) => !i.isChecked).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              GroceryList
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="/"
              className="hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              My List
            </a>
            <a
              href="/"
              className="hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              Categories
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-semibold text-secondary-foreground">
                U
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="py-10 px-4"
        style={{ background: "oklch(0.96 0.03 160)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Smart Grocery List
          </h1>
          <p className="text-muted-foreground text-base">
            Organize your shopping, track what's needed, never forget a thing.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: List area (~70%) */}
          <div className="flex-1 min-w-0">
            {/* Add item form */}
            <div className="bg-card rounded-xl border border-border shadow-xs p-5 mb-6">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Add New Item
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="grocery.input"
                    placeholder="Item name (e.g. Tomatoes)"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                    className="pl-9"
                  />
                </div>
                <Input
                  data-ocid="quantity.input"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-20"
                />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    data-ocid="category.select"
                    className="w-full sm:w-44"
                  >
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  data-ocid="grocery.submit_button"
                  onClick={handleAddItem}
                  disabled={addItem.isPending || !itemName.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {addItem.isPending ? (
                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add Item
                </Button>
              </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="grocery.search_input"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "pending", "checked"] as FilterTab[]).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    data-ocid="filter.tab"
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === tab
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {tab === "all" && `All (${items.length})`}
                    {tab === "pending" && `Pending (${pendingCount})`}
                    {tab === "checked" && `Checked (${checkedCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {isLoading ? (
              <div data-ocid="grocery.loading_state" className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <motion.div
                data-ocid="grocery.empty_state"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 text-muted-foreground"
              >
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">
                  {searchQuery || filter !== "all"
                    ? "No items match your filter."
                    : "Your list is empty!"}
                </p>
                <p className="text-sm mt-1">
                  {!searchQuery && filter === "all"
                    ? "Add your first grocery item above to get started."
                    : "Try changing the filter or search term."}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-5">
                <AnimatePresence>
                  {Object.entries(grouped).map(([cat, catItems], groupIdx) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: groupIdx * 0.05 }}
                      className="bg-card rounded-xl border border-border shadow-xs overflow-hidden"
                    >
                      <div className="px-5 py-3 bg-muted flex items-center gap-2 border-b border-border">
                        <span className="text-muted-foreground">
                          {CATEGORY_ICONS[cat]}
                        </span>
                        <span className="font-semibold text-sm text-foreground">
                          {cat}
                        </span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {catItems.length}{" "}
                          {catItems.length === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                      <ul>
                        <AnimatePresence>
                          {catItems.map((item, itemIdx) => (
                            <motion.li
                              key={item.itemId.toString()}
                              data-ocid={`grocery.item.${itemIdx + 1}`}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ delay: itemIdx * 0.03 }}
                              className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                            >
                              <Checkbox
                                data-ocid={`grocery.checkbox.${itemIdx + 1}`}
                                checked={item.isChecked}
                                onCheckedChange={(checked) =>
                                  toggleItem.mutate({
                                    itemId: item.itemId,
                                    isChecked: checked === true,
                                  })
                                }
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <span
                                className={`flex-1 text-sm font-medium transition-all ${
                                  item.isChecked
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                ×{item.quantity.toString()}
                              </span>
                              <span
                                className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                  CATEGORY_COLORS[item.category] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {item.category}
                              </span>
                              <button
                                type="button"
                                data-ocid={`grocery.delete_button.${itemIdx + 1}`}
                                onClick={() =>
                                  deleteItem.mutate(item.itemId, {
                                    onError: () =>
                                      toast.error("Failed to delete item"),
                                  })
                                }
                                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Action buttons */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      data-ocid="grocery.secondary_button"
                      variant="outline"
                      disabled={checkedCount === 0 || clearChecked.isPending}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      {clearChecked.isPending ? (
                        <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Clear Checked Items ({checkedCount})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="grocery.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Checked Items?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all {checkedCount} checked items from
                        your list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="grocery.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="grocery.confirm_button"
                        onClick={() =>
                          clearChecked.mutate(undefined, {
                            onSuccess: () =>
                              toast.success("Checked items cleared!"),
                            onError: () => toast.error("Failed to clear items"),
                          })
                        }
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Yes, Clear
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      data-ocid="grocery.delete_button"
                      disabled={clearAll.isPending}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {clearAll.isPending ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ListTodo className="w-4 h-4" />
                      )}
                      Start New List
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent data-ocid="grocery.dialog">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start a New List?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {items.length} items.
                        You cannot undo this.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="grocery.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        data-ocid="grocery.confirm_button"
                        onClick={() =>
                          clearAll.mutate(undefined, {
                            onSuccess: () =>
                              toast.success("List cleared! Starting fresh."),
                            onError: () => toast.error("Failed to clear list"),
                          })
                        }
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, Start New
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Sidebar (~30%) */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
            {/* Category breakdown */}
            <div className="bg-card rounded-xl border border-border shadow-xs p-5">
              <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-primary" />
                Categories
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const count = items.filter(
                      (i) => i.category === cat,
                    ).length;
                    return (
                      <li
                        key={cat}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {CATEGORY_ICONS[cat]}
                          <span>{cat}</span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            count > 0
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {count}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Progress */}
            {items.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-xs p-5">
                <h3 className="font-semibold text-sm text-foreground mb-3">
                  Shopping Progress
                </h3>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{checkedCount} checked</span>
                  <span>{pendingCount} remaining</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        items.length > 0
                          ? (checkedCount / items.length) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {items.length > 0
                    ? `${Math.round((checkedCount / items.length) * 100)}% complete`
                    : ""}
                </p>
              </div>
            )}

            {/* Quick Add Tips */}
            <div
              className="rounded-xl border p-5"
              style={{
                background: "oklch(0.96 0.03 160)",
                borderColor: "oklch(0.88 0.06 165)",
              }}
            >
              <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Quick Add Tips
              </h3>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Press{" "}
                  <kbd className="px-1 py-0.5 bg-white/60 rounded text-[10px] border border-border">
                    Enter
                  </kbd>{" "}
                  to quickly add an item.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Check items off as you shop to track progress.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Use "Clear Checked" to remove bought items.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  Items are grouped by category for easy navigation.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GroceryApp />
    </QueryClientProvider>
  );
}
