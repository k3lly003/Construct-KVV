import DefaultPageBanner from '@/app/(components)/DefaultPageBanner'
import { FormContainer } from '@/app/(components)/build-house/form-container'
// import { PageHeader } from '../../(components)/build-house/page-header'
import { FormProvider } from '@/state/form-context'

const page = () => {
  return (
    <>
      <DefaultPageBanner backgroundImage={'./create-house.jpg'} title={'Create Your Dream House'} />
      {/* <PageHeader />  */}
      <div className="flex-1 py-8">
        <FormProvider>
          <FormContainer />
        </FormProvider>
      </div>
    </>
  )
}

export default page