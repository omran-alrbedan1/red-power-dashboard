import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Plus,
  UserRoundPlus,
} from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"

import { CustomerForm } from "../components/CustomerForm"
import { useCreateCustomer } from "../hooks/useCustomers"

import type { CustomerFormValues } from "../validation/customer.validation"
import { images } from "@/constants/images"

const CustomerCreatePage: React.FC = () => {
  const { t } = useTranslation("customers")
  const navigate = useNavigate()

  const createCustomer = useCreateCustomer()

  const handleSubmit = (
    values: CustomerFormValues,
  ) => {
    createCustomer.mutate(values, {
      onSuccess: (customer) => {
        navigate(
          `/customers/${customer.id}`,
          {
            replace: true,
          },
        )
      },
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t(
          "addCustomer",
          "Add Customer",
        )}
        description={t(
          "addCustomerDescription",
          "Create a new customer profile for your workshop.",
        )}
        backgroundImage={images.createCustomerHero}
        showBackButton
        backButtonLabel={t(
          "backToList",
          "Back to customers",
        )}
        onBackClick={() =>
          navigate("/customers")
        }
        showDateTime
      />

      <section
        className="
          overflow-hidden
          rounded-2xl
          border border-border/60
          bg-background-card
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center gap-3
            border-b border-border/60
            px-5 py-5
            sm:px-6
          "
        >
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <UserRoundPlus className="h-5 w-5" />
          </div>

          <div>
            <h2
              className="
                text-base font-bold
                text-text-primary
              "
            >
              {t(
                "form.customerInformation",
                "Customer Information",
              )}
            </h2>

            <p
              className="
                mt-1 text-xs
                text-text-muted
              "
            >
              {t(
                "form.customerInformationDescription",
                "Add the customer's contact information to your garage system.",
              )}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">
          <CustomerForm
            onSubmit={handleSubmit}
            isSubmitting={
              createCustomer.isPending
            }
            submitLabel={t(
              "addCustomer",
              "Add Customer",
            )}
            submitIcon={
              <Plus className="h-4 w-4" />
            }
          />
        </div>
      </section>
    </div>
  )
}

export default CustomerCreatePage