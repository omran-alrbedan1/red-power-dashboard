import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Plus, UserRoundPlus } from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"

import { EmployeeForm } from "../components/EmployeeForm"
import { useCreateEmployee } from "../hooks/useEmployees"
import type { CreateEmployeeInput } from "../services/employees.service"
import type { EmployeeFormValues } from "../validation/employee.validation"
import { images } from "@/constants/images"

const EmployeeCreatePage: React.FC = () => {
  const { t } = useTranslation("employees")
  const navigate = useNavigate()

  const createEmployee = useCreateEmployee()

  const handleSubmit = (values: EmployeeFormValues) => {
    // Role is never sent by the client. The backend enforces ADMIN.
    const payload: CreateEmployeeInput = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    }

    createEmployee.mutate(payload, {
      onSuccess: () => {
        navigate("/employees", { replace: true })
      },
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={t("addEmployee", "Add Employee")}
        description={t("addEmployeeDescription", "Create a new staff account to access the dashboard.")}
        backgroundImage={images.employeesHero}
        showBackButton
        backButtonLabel={t("backToList", "Back to employees")}
        onBackClick={() => navigate("/employees")}
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
            <h2 className="text-base font-bold text-text-primary">
              {t("addEmployee", "Add Employee")}
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              {t("addEmployeeDescription", "Create a new staff account to access the dashboard.")}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <EmployeeForm
            onSubmit={handleSubmit}
            isSubmitting={createEmployee.isPending}
            submitLabel={t("addEmployee", "Add Employee")}
            submitIcon={<Plus className="h-4 w-4" />}
          />
        </div>
      </section>
    </div>
  )
}

export default EmployeeCreatePage