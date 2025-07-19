import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  @Input() formConfig!: any;
  form!: FormGroup;
  filePreviews: Record<string, string> = {};

  ngOnInit(): void {
    console.log(this.formConfig);
    this.buildForm(this.formConfig.fields);
  }

  buildForm(fields: any[] = []) {
    const group: any = {};
    fields.forEach((field) => {
      let validators = [];
      if (field.validations) {
        for (const v of field.validations) {
          if (v.type === 'required') validators.push(Validators.required);
          if (v.type === 'email') validators.push(Validators.email);
          if (v.type === 'minLength')
            validators.push(Validators.minLength(v.value));
        }
      }

      if (field.type === 'checkbox') {
        group[field.key] = new FormControl([]);
      } else if (field.type === 'switch') {
        group[field.key] = new FormControl(false);
      } else {
        group[field.key] = new FormControl('', validators);
      }
    });

    this.form = new FormGroup(group);
  }

  onFileChange(event: Event, field: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && field.accept.includes(file.type)) {
      this.form.patchValue({ [field.key]: file });
      const reader = new FileReader();
      reader.onload = () =>
        (this.filePreviews[field.key] = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.form.get(field.key)?.setErrors({ fileType: true });
    }
  }

  onCheckboxChange(fieldKey: string, value: string, event: any) {
    const field = this.form.get(fieldKey);
    const current = field?.value || [];
    if (event?.target?.checked) {
      field?.setValue([...current, value]);
    } else {
      field?.setValue(current.filter((v: string) => v !== value));
    }
  }

  getError(field: any): string | null {
    const control = this.form.get(field.key);
    if (control?.touched && control?.errors) {
      for (const rule of field.validations || []) {
        if (control.hasError(rule.type)) return rule.message;
        if (rule.type === 'fileType' && control.hasError('fileType'))
          return rule.message;
      }
    }
    return null;
  }

  onButtonClick(button: any) {
    if (button.type === 'submit') {
      if (this.form.valid) {
        console.log('Form Data:', this.form.value);
        alert("Data updated success fully !!")
      } else {
        this.form.markAllAsTouched();
      }
    } else if (button.key === 'reset') {
      this.form.reset();
      this.filePreviews = {};
    }
  }

  getMockedResponse() {
    // insert the JSON structure shown above
    return {
      /*...*/
    };
  }
}
