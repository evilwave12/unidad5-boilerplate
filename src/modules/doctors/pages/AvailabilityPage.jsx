import NewAvailabilityForm from '../components/NewAvailabilityForm'

function AvailabilityPage(){
    
    return(
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
                    Gestionar Disponibilidad Horaria
                </h1>
                <p className="text-sm text-med-text-sub mt-1">
                    Configure los días y horarios de atención para cada profesional médico.
                </p>
            </div>

            <NewAvailabilityForm />
        </div>
    );
}

export default AvailabilityPage;