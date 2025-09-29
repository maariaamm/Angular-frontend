import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AddAd } from './add-ad';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { ModalService } from '../../services/modal-service';
import AuthData from '../../models/AuthData';
import CarAd from '../../models/CarAd';

describe('AddAd', () => {
  let component: AddAd;
  let fixture: ComponentFixture<AddAd>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  const mockAuthData: AuthData = {
    message: 'Login successful!',
    token: 'valid-token',
    user: {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    }
  };

  const mockCarAd: CarAd = {
    _id: '123',
    brand: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    description: 'Great car',
    imageUrl: 'https://example.com/image.jpg',
    fuelType: 'Gasoline',
    createdAt: new Date()
  };

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['createAd', 'fetchCars']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['authData']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockModalService = jasmine.createSpyObj('ModalService', ['openErrorModal']);

    await TestBed.configureTestingModule({
      imports: [AddAd],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const currentYear = new Date().getFullYear();
    
    expect(component.brand).toBe('');
    expect(component.model).toBe('');
    expect(component.year).toBe(currentYear);
    expect(component.price).toBe(0);
    expect(component.description).toBe('');
    expect(component.imageUrl).toBe('');
    expect(component.fuelType).toBe('');
  });

  describe('onSubmit', () => {
    let mockForm: jasmine.SpyObj<NgForm>;

    beforeEach(() => {
      mockForm = jasmine.createSpyObj('NgForm', [], { valid: true });
      
      component.brand = 'Toyota';
      component.model = 'Camry';
      component.year = 2022;
      component.price = 25000;
      component.description = 'Great car';
      component.imageUrl = 'https://example.com/image.jpg';
      component.fuelType = 'Gasoline';
    });

    it('should create ad successfully when form is valid and user is authenticated', async () => {
      mockAuthService.authData.and.returnValue(mockAuthData);
      mockApiService.createAd.and.returnValue(of(mockCarAd));

      await component.onSubmit(mockForm);

      expect(mockApiService.createAd).toHaveBeenCalledWith({
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25000,
        description: 'Great car',
        imageUrl: 'https://example.com/image.jpg',
        fuelType: 'Gasoline'
      }, 'valid-token');
      
      expect(mockApiService.fetchCars).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockModalService.openErrorModal).not.toHaveBeenCalled();
    });

    it('should open error modal when user is not authenticated', async () => {
      mockAuthService.authData.and.returnValue(undefined);

      await component.onSubmit(mockForm);

      expect(mockModalService.openErrorModal).toHaveBeenCalledWith('unauthorized');
      expect(mockApiService.createAd).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should open error modal when user has empty token', async () => {
      const authDataWithEmptyToken = { ...mockAuthData, token: '' };
      mockAuthService.authData.and.returnValue(authDataWithEmptyToken);

      await component.onSubmit(mockForm);

      expect(mockModalService.openErrorModal).toHaveBeenCalledWith('unauthorized');
      expect(mockApiService.createAd).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle API error when creating ad fails', async () => {
      mockAuthService.authData.and.returnValue(mockAuthData);
      mockApiService.createAd.and.returnValue(throwError(() => new Error('API Error')));

      await component.onSubmit(mockForm);

      expect(mockApiService.createAd).toHaveBeenCalled();
      expect(mockModalService.openErrorModal).toHaveBeenCalledWith('failing-creating-ad');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should log message when form is invalid', async () => {
      mockForm = jasmine.createSpyObj('NgForm', [], { valid: false });

      await component.onSubmit(mockForm);

      expect(mockApiService.createAd).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not create ad when called without form parameter (form is undefined)', async () => {
      mockAuthService.authData.and.returnValue(mockAuthData);
      mockApiService.createAd.and.returnValue(of(mockCarAd));

      await component.onSubmit();

      expect(mockApiService.createAd).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should create ad when form is explicitly valid', async () => {
      const validForm = jasmine.createSpyObj('NgForm', [], { valid: true });
      mockAuthService.authData.and.returnValue(mockAuthData);
      mockApiService.createAd.and.returnValue(of(mockCarAd));

      await component.onSubmit(validForm);

      expect(mockApiService.createAd).toHaveBeenCalledWith({
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25000,
        description: 'Great car',
        imageUrl: 'https://example.com/image.jpg',
        fuelType: 'Gasoline'
      }, 'valid-token');
      
      expect(mockApiService.fetchCars).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('form binding', () => {
    it('should bind form inputs to component properties', () => {
      const compiled = fixture.nativeElement;
      
      const brandInput = compiled.querySelector('#brand');
      const modelInput = compiled.querySelector('#model');
      const yearInput = compiled.querySelector('#year');
      const priceInput = compiled.querySelector('#price');
      const descriptionInput = compiled.querySelector('#description');
      const imageUrlInput = compiled.querySelector('#imageUrl');
      const fuelTypeInput = compiled.querySelector('#fuelType');

      expect(brandInput).toBeTruthy();
      expect(modelInput).toBeTruthy();
      expect(yearInput).toBeTruthy();
      expect(priceInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(imageUrlInput).toBeTruthy();
      expect(fuelTypeInput).toBeTruthy();
    });

    it('should update component properties when inputs change', () => {
      const compiled = fixture.nativeElement;
      
      const brandInput = compiled.querySelector('#brand');
      brandInput.value = 'Honda';
      brandInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(brandInput.value).toBe('Honda');
    });

    it('should display current year as default in year input', () => {
      const compiled = fixture.nativeElement;
      const yearInput = compiled.querySelector('#year');
      
      expect(yearInput.value).toBe(new Date().getFullYear().toString());
    });
  });
});
