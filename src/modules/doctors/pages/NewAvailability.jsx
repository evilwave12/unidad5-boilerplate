import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import NewAvailabilityForm from './components/NewAvailabilityForm'

function NewAvailability(){
    
    return(
        <div>
            
            <NewAvailabilityForm/>

        </div>
    );

}

export default NewAvailability;