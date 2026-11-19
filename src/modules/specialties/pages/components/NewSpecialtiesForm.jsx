import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { SpecialtiesService } from '../services/SpecialtiesService';

function NewSpecialtiesForm({ onSuccess, onCancel }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, //noentiendo esto
  } = useForm({
    //es necesario esto?
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  const onValid = async (formData) => {
    try {
      setErrorMessage('');
      await SpecialtiesService.createSpecialty(formData);
      onSuccess();
    } catch {
      setErrorMessage('No se pudo crear la especialidad. Intente nuevamente.');
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onValid)}>
      <Input
        label="Nombre de la Especialidad"
        placeholder="Ej. Cardiología Intervencionista"
        {...register('name', {
          required: 'El nombre de la especialidad es obligatorio',
          minLength: {value:3, message:"Debe tener al menos 3 caractéres"},
          maxLength:{value: 100, message:"Debe tener menos de 100 caractéres"},
        })}
        error={errors.name?.message}
      />

      {/* Input.jsx solo renderiza <input>, así que el textarea va a mano */}
      <div className='flex flex-col gap-1.5 w-full'>
        <label className='text-xs font-semibold text-med-text-main'>
          Descripción
        </label>

        <textarea 
        rows={5} 
        placeholder='Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación'
        {...register('description',{
          required:'La descripción de la especialidad es obligatoria',
          minLength: {value:10, message:"Debe tener al menos 10 caractéres"},
          maxLength:{value: 100, message:"Debe tener menos de 100 caractéres"},
        })}
        />

        {errors.description && (
          <p className='text-xs text-red-500 font-medium'>
            {errors.description.message}
          </p>
        )}

      </div>

      {/* Input.jsx solo renderiza <input>, así que el select va a mano */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-medium text-med-text-sub">
          Estado inicial
        </label>

        <div className="relative">
          <select
            {...register('isActive', {
              setValueAs:(value)=>value==='true' || value===true, //indica como transformar el valor del select antes de guardarlo y enviarlo a onvalid
            })}
            className="w-full appearance-none border border-med-border rounded-lg pl-3.5 pr-10 py-2.5 text-sm font-medium bg-white text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 cursor-pointer"
          >

            <option value="true">Activo - Disponible para programación</option>
            <option value="false">Inactivo - No Disponible</option>

          </select>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-med-text-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>

        {errors.isActive && (
          <p className="text-xs text-red-500 font-medium">
            {errors.isActive.message}
          </p>
        )}
      </div>

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

export default NewSpecialtiesForm;
