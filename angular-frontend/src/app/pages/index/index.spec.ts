import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { Index } from './index';
import { ApiService } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';
import { ModalService } from '../../services/modal-service';
import CarAd from '../../models/CarAd';
import AuthData from '../../models/AuthData';
import { Component } from '@angular/core';

@Component({ 
  selector: 'app-dummy',
  template: '',
  standalone: true
})
class DummyComponent { }

describe('Index', () => {
  let component: Index;
  let fixture: ComponentFixture<Index>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockActivatedRoute: any;
  let queryParamsSubject: BehaviorSubject<any>;
  let dataSubject: BehaviorSubject<any>;

  const mockCarAds: CarAd[] = [
    {
      _id: '1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2020,
      description: 'Great car',
      fuelType: 'Gasoline',
      price: 25000,
      createdAt: new Date(),
      imageUrl: 'test-image1.jpg',
      user: {
        _id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashedpassword',
        role: 'user'
      }
    },
    {
      _id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      description: 'Reliable car',
      fuelType: 'Gasoline',
      price: 23000,
      createdAt: new Date(),
      imageUrl: 'test-image2.jpg',
      user: {
        _id: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        password: 'hashedpassword',
        role: 'user'
      }
    }
  ];

  const mockAuthData: AuthData = {
    message: 'Login successful!',
    token: 'test-token',
    user: {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user'
    }
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject({});
    dataSubject = new BehaviorSubject({});

    mockApiService = jasmine.createSpyObj('ApiService', [
      'hasData',
      'getData',
      'fetchCars'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['authData'], {
      isLoggedInSignal: jasmine.createSpy().and.returnValue(false),
      authData: jasmine.createSpy().and.returnValue(mockAuthData)
    });

    mockModalService = jasmine.createSpyObj('ModalService', [
      'openErrorModal',
      'openLoginModal',
      'openSignupModal'
    ]);

    mockActivatedRoute = {
      queryParams: queryParamsSubject.asObservable(),
      data: dataSubject.asObservable()
    };

    mockApiService.hasData.and.returnValue(false);
    mockApiService.fetchCars.and.returnValue(of(mockCarAds));
    mockApiService.getData.and.returnValue(of(mockCarAds));

    await TestBed.configureTestingModule({
      imports: [
        Index,
        DummyComponent,
        RouterTestingModule.withRoutes([
          { path: 'ad-details/:id', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Index);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial properties', () => {
    expect(component.title).toBe('Car web site');
    expect(component.isLoggedIn).toBeDefined();
  });

  it('should open error modal when errorMessage query parameter is present', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    
    queryParamsSubject.next({ errorMessage: 'Test error message' });
    
    fixture.detectChanges();

    expect(mockModalService.openErrorModal).toHaveBeenCalledWith('Test error message');
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { errorMessage: null },
      queryParamsHandling: 'merge'
    });
  });

  it('should open login modal when login data is present', () => {
    dataSubject.next({ login: true });
    
    fixture.detectChanges();

    expect(mockModalService.openLoginModal).toHaveBeenCalled();
  });

  it('should open signup modal when signup data is present', () => {
    dataSubject.next({ signup: true });
    
    fixture.detectChanges();

    expect(mockModalService.openSignupModal).toHaveBeenCalled();
  });

  it('should use cached data when available on ngOnInit', () => {
    mockApiService.hasData.and.returnValue(true);
    
    component.ngOnInit();

    expect(mockApiService.getData).toHaveBeenCalled();
    expect(mockApiService.fetchCars).not.toHaveBeenCalled();
    expect(component.carsAd).toBeDefined();
  });

  it('should fetch cars when no cached data is available on ngOnInit', () => {
    mockApiService.hasData.and.returnValue(false);
    
    component.ngOnInit();

    expect(mockApiService.fetchCars).toHaveBeenCalled();
    expect(mockApiService.getData).not.toHaveBeenCalled();
    expect(component.carsAd).toBeDefined();
  });

  it('should filter cars for current user when myCars data is present and cached data exists', () => {
    mockApiService.hasData.and.returnValue(true);
    dataSubject.next({ myCars: true });
    
    component.ngOnInit();

    expect(mockApiService.getData).toHaveBeenCalled();
    expect(component.carsAd).toBeDefined();
    
    component.carsAd?.subscribe(cars => {
      const filteredCars = cars.filter(car => car.user?._id === mockAuthData.user.id);
      expect(filteredCars.length).toBe(1);
      expect(filteredCars[0]._id).toBe('1');
    });
  });

  it('should filter cars for current user when myCars data is present and no cached data exists', () => {
    mockApiService.hasData.and.returnValue(false);
    dataSubject.next({ myCars: true });
    
    component.ngOnInit();

    expect(mockApiService.fetchCars).toHaveBeenCalled();
    expect(component.carsAd).toBeDefined();
    
    component.carsAd?.subscribe(cars => {
      const filteredCars = cars.filter(car => car.user?._id === mockAuthData.user.id);
      expect(filteredCars.length).toBe(1);
      expect(filteredCars[0]._id).toBe('1');
    });
  });

  it('should handle missing auth data when filtering for myCars', () => {
    mockAuthService.authData.and.returnValue(undefined);
    mockApiService.hasData.and.returnValue(true);
    dataSubject.next({ myCars: true });
    
    component.ngOnInit();

    expect(component.carsAd).toBeDefined();
    
    component.carsAd?.subscribe(cars => {
      expect(cars.length).toBe(0);
    });
  });

  it('should not open any modal when no special query parameters or data are present', () => {
    queryParamsSubject.next({});
    dataSubject.next({});
    
    fixture.detectChanges();

    expect(mockModalService.openErrorModal).not.toHaveBeenCalled();
    expect(mockModalService.openLoginModal).not.toHaveBeenCalled();
    expect(mockModalService.openSignupModal).not.toHaveBeenCalled();
  });

  it('should handle multiple data subscriptions correctly', () => {
    dataSubject.next({ login: true });
    fixture.detectChanges();
    
    expect(mockModalService.openLoginModal).toHaveBeenCalled();
    
    dataSubject.next({ myCars: true });
    component.ngOnInit();
    
    expect(component.carsAd).toBeDefined();
  });

  it('should handle cars without user data when filtering for myCars', () => {
    const carsWithoutUser: CarAd[] = [
      { ...mockCarAds[0], user: undefined },
      { ...mockCarAds[1], user: undefined }
    ];
    
    mockApiService.getData.and.returnValue(of(carsWithoutUser));
    mockApiService.hasData.and.returnValue(true);
    dataSubject.next({ myCars: true });
    
    component.ngOnInit();
    
    component.carsAd?.subscribe(cars => {
      expect(cars.length).toBe(0);
    });
  });
});
