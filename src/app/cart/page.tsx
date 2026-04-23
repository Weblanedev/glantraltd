import { CartView } from '@/components/CartView'
import { PageHeader } from '@/components/PageHeader'

export const metadata = { title: 'Cart' }

export default function CartPage() {
  return (
    <div>
      <PageHeader
        title="Your cart"
        description="Review quantities and line totals, then head to checkout when you’re ready."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart' },
        ]}
      />
      <CartView />
    </div>
  )
}
