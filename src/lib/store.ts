/**
 * Store / catalog integration (DummyJSON).
 */
export type {
  StoreProduct,
  StoreListResponse,
  BestBuyProduct,
  BestBuyProductsResponse,
  ProductCategoryPath,
} from '@/lib/store-types'

export {
  DUMMYJSON_BASE,
  fetchDummyJsonProducts,
  getDummyJsonProductById,
  pickImage,
  StoreApiError,
} from '@/lib/dummyjson'

export { getDummyJsonProductById as getProductBySku } from '@/lib/dummyjson'

/** @deprecated use StoreApiError */
export { StoreApiError as BestBuyApiError } from '@/lib/dummyjson'
