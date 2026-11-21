import { useState } from 'react';
import { useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { createDoctor } from '../services/DoctorsService';
import { getAllSpecialties } from '../../specialties/services/SpecialtiesService';


function NewDoctorForm({ onSuccess, onCancel }) {

  const [errorMessage, setErrorMessage] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecialities, setLoadingSpecialities] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, //noentiendo esto
  } = useForm({
    defaultValues: {
      name: '',
      licenseNumber: '',
      specialtyId: '',
    },
  });

  const onValid = async (formData) => { //onValid: se llama solamente si todas las validaciones pasaron
    try {
      setErrorMessage('');
      await createDoctor(formData);
      onSuccess();
    } catch {
      setErrorMessage('No se pudo crear el doctor. Intente nuevamente.');
    }
  };

  // 1. Cargar lista de especialidades al montar el componente
    useEffect(() => {
      const fetchSpecialties = async () => {
        try {
          setLoadingSpecialities(true);
          const list = await getAllSpecialties();
          setSpecialties(list);
          if (list.length > 0) {
            setValue('specialtyId', String(list[0].id));
          }
        } catch (error) {
          console.error('Error al cargar especialidades:', error);
          setErrorMessage('No se pudo cargar la lista de especialidades.');
        } finally {
          setLoadingSpecialities(false);
        }
      };
  
      fetchSpecialties();
    }, [setValue]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onValid)}>
      <Input
        label="Nombre completo del doctor"
        placeholder="Ej. Dr. Alejandro Martínez"
        {...register('name', { required: 'El nombre es obligatorio' })}
        error={errors.name?.message}
      />

      {/* Input.jsx solo renderiza <input>, así que el select va a mano */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-med-text-main">
          Especialidad
        </label>
        <select
          {...register('specialtyId', {
            required: 'La especialidad es obligatoria',
          })}
          disabled={loadingSpecialities || isSubmitting}
          className="w-full border border-med-border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
        >
          {specialties.length === 0 && (
            <option value="">
              {loadingSpecialities
                ? 'Cargando especialidades...'
                : 'Sin especialidades registradas'}
            </option>
          )}
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>
        
        {errors.specialtyId && (
          <p className="text-xs text-red-500 font-medium">
            {errors.specialtyId.message}
          </p>
        )}
      </div>

      <Input
        label="Matrícula"
        placeholder="Ej. MED-3186"
        {...register('licenseNumber', { required: 'La matrícula es obligatoria' })}
        error={errors.licenseNumber?.message}
      />

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}

export default NewDoctorForm;