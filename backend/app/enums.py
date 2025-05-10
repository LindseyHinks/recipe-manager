import enum

class CategoryEnum(enum.Enum):
    """Enum of ingredient categories for consistent use across the app"""
    MEAT = "meat"
    FISH = "fish"
    DAIRY = "dairy"
    VEGETABLES = "vegetables"
    FRUITS = "fruits"
    FREEZER = "freezer"
    BREAD = "bread"
    CARBS = "carbs"
    SNACKS = "snacks"
    HERBS_SPICES = "herbs_spices"
    CONDIMENTS = "condiments"
    OTHER = "other"