using Agronexis.DataAccess.DbContexts;
using Agronexis.ExternalApi;
using Agronexis.Model;
using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.X509;
using PuppeteerSharp;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Agronexis.DataAccess.ConfigurationsRepository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly ExternalUtility _externalUtility;
        private readonly ILogger<ConfigurationRepository> _logger;
        private readonly IConverter _pdfConverter;
        private readonly IServiceProvider _serviceProvider;

        public ConfigurationRepository(
            AppDbContext dbContext, 
            IConfiguration configuration, 
            ExternalUtility externalUtility, 
            ILogger<ConfigurationRepository> logger,
            IConverter pdfConverter, 
            IServiceProvider serviceProvider)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _externalUtility = externalUtility;
            _logger = logger;
            _pdfConverter = pdfConverter;
            _serviceProvider = serviceProvider;
        }
        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            try
            {
                var productList = (
                    from P in _dbContext.Products
                        .Include(p => p.ProductPrices)
                            .ThenInclude(pp => pp.Weight)
                        .Include(p => p.ProductPrices)
                            .ThenInclude(pp => pp.Currency)
                    join C in _dbContext.Categories
                        on P.CategoryId equals C.Id
                    where P.IsActive && C.IsActive
                    select new { P, C }
                )
                .AsEnumerable()
                .Select(x => new ProductResponseModel
                {
                    Id = x.P.Id,
                    Name = x.P.Name,
                    Description = x.P.Description,
                    ManufacturingDate = x.P.ManufacturingDate,
                    ImageUrls = JsonSerializer.Deserialize<List<string>>(x.P.ImageUrls ?? "[]"),
                    KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.P.KeyFeatures ?? "[]"),
                    Uses = JsonSerializer.Deserialize<List<string>>(x.P.Uses ?? "[]"),
                    CategoryId = x.P.CategoryId,
                    CategoryName = x.C.Name,
                    BrandId = x.P.BrandId,
                    MetaTitle = x.P.MetaTitle,
                    MetaDescription = x.P.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = x.P.Origin,
                    ShelfLife = x.P.ShelfLife,
                    StorageInstructions = x.P.StorageInstructions,
                    Certifications = JsonSerializer.Deserialize<List<string>>(x.P.Certifications ?? "[]"),
                    IsActive = x.P.IsActive,
                    IsPremium = x.P.IsPremium,
                    IsFeatured = x.P.IsFeatured,
                    Ingredients = x.P.Ingredients,
                    NutritionalInfo = x.P.NutritionalInfo,
                    ThumbnailUrl = x.P.ThumbnailUrl,

                    PricesAndSkus = x.P.ProductPrices.Select(pp => new PriceResponseModel
                    {
                        Id = pp.Id,
                        CurrencyId = pp.Currency.Id,
                        CurrencyCode = pp.Currency.Code,
                        Price = pp.Price,
                        CreatedDate = pp.CreatedDate,
                        ModifiedDate = pp.ModifiedDate,
                        IsDiscounted = pp.IsDiscounted,
                        DiscountPercentage = pp.DiscountPercentage,
                        DiscountedAmount = pp.DiscountedAmount,
                        WeightId = pp.WeightId,
                        WeightValue = pp.Weight?.Value,
                        WeightUnit = pp.Weight?.Unit,
                        SkuNumber = pp.SkuNumber,
                        Barcode = pp.Barcode,
                        IsActive = pp.IsActive,
                        IsDeleted = pp.IsDeleted
                    }).ToList(),
                }).ToList();

                return productList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error in {nameof(GetProducts)}", xCorrelationId, ex);
            }
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            try
            {
                Guid productId = Guid.Parse(id);

                var rawResult = (
                    from P in _dbContext.Products
                        .Include(p => p.ProductPrices)
                            .ThenInclude(pp => pp.Weight)
                        .Include(p => p.ProductPrices)
                            .ThenInclude(pp => pp.Currency)
                    join C in _dbContext.Categories on P.CategoryId equals C.Id
                    where P.Id == productId
                    select new { P, C }
                ).FirstOrDefault();

                if (rawResult == null) return null;

                var product = rawResult.P;

                return new ProductResponseModel
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    ManufacturingDate = product.ManufacturingDate,
                    ImageUrls = JsonSerializer.Deserialize<List<string>>(product.ImageUrls ?? "[]"),
                    KeyFeatures = JsonSerializer.Deserialize<List<string>>(product.KeyFeatures ?? "[]"),
                    Uses = JsonSerializer.Deserialize<List<string>>(product.Uses ?? "[]"),
                    CategoryId = product.CategoryId,
                    CategoryName = rawResult.C.Name,
                    BrandId = product.BrandId,
                    MetaTitle = product.MetaTitle,
                    MetaDescription = product.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = product.Origin,
                    ShelfLife = product.ShelfLife,
                    StorageInstructions = product.StorageInstructions,
                    Certifications = JsonSerializer.Deserialize<List<string>>(product.Certifications ?? "[]"),
                    IsActive = product.IsActive,
                    IsPremium = product.IsPremium,
                    IsFeatured = product.IsFeatured,
                    Ingredients = product.Ingredients,
                    NutritionalInfo = product.NutritionalInfo,
                    ThumbnailUrl = product.ThumbnailUrl,
                    PricesAndSkus = product.ProductPrices
                        .Where(pp => !pp.IsDeleted)
                        .Select(pp => new PriceResponseModel
                        {
                            Id = pp.Id,
                            CurrencyId = pp.Currency.Id,
                            CurrencyCode = pp.Currency.Code,
                            Price = pp.Price,
                            CreatedDate = pp.CreatedDate,
                            ModifiedDate = pp.ModifiedDate,
                            IsDiscounted = pp.IsDiscounted,
                            DiscountPercentage = pp.DiscountPercentage,
                            DiscountedAmount = pp.DiscountedAmount,
                            WeightId = pp.WeightId,
                            WeightValue = pp.Weight?.Value,
                            WeightUnit = pp.Weight?.Unit,
                            SkuNumber = pp.SkuNumber,
                            Barcode = pp.Barcode,
                            IsActive = pp.IsActive,
                            IsDeleted = pp.IsDeleted
                        }).ToList()
                };
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error in {nameof(GetProductById)}", xCorrelationId, ex);
            }
        }

        public List<ProductResponseModel> GetProductsByCategory(string categoryId, string xCorrelationId)
        {
            try
            {
                Guid catId = Guid.Parse(categoryId);

                var productList = (
                    from P in _dbContext.Products
                        .Include(p => p.ProductPrices)
                        .ThenInclude(pp => pp.Weight)
                        .Include(p => p.ProductPrices)
                        .ThenInclude(pp => pp.Currency)
                    join C in _dbContext.Categories on P.CategoryId equals C.Id
                    where P.IsActive && P.CategoryId == catId
                    select new { P, C }
                )
                .AsEnumerable()
                .Select(x => new ProductResponseModel
                {
                    Id = x.P.Id,
                    Name = x.P.Name,
                    Description = x.P.Description,
                    ManufacturingDate = x.P.ManufacturingDate,

                    ImageUrls = JsonSerializer.Deserialize<List<string>>(x.P.ImageUrls ?? "[]"),
                    KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.P.KeyFeatures ?? "[]"),
                    Uses = JsonSerializer.Deserialize<List<string>>(x.P.Uses ?? "[]"),
                    Certifications = JsonSerializer.Deserialize<List<string>>(x.P.Certifications ?? "[]"),

                    CategoryId = x.P.CategoryId,
                    CategoryName = x.C.Name,
                    BrandId = x.P.BrandId,
                    MetaTitle = x.P.MetaTitle,
                    MetaDescription = x.P.MetaDescription,
                    CreatedDate = DateTime.UtcNow,
                    Origin = x.P.Origin,
                    ShelfLife = x.P.ShelfLife,
                    StorageInstructions = x.P.StorageInstructions,
                    IsActive = x.P.IsActive,
                    IsPremium = x.P.IsPremium,
                    IsFeatured = x.P.IsFeatured,
                    Ingredients = x.P.Ingredients,
                    NutritionalInfo = x.P.NutritionalInfo,
                    ThumbnailUrl = x.P.ThumbnailUrl,

                    PricesAndSkus = x.P.ProductPrices.Select(pp => new PriceResponseModel
                    {
                        Id = pp.Id,
                        CurrencyId = pp.Currency.Id,
                        CurrencyCode = pp.Currency.Code,
                        Price = pp.Price,
                        CreatedDate = pp.CreatedDate,
                        ModifiedDate = pp.ModifiedDate,
                        IsDiscounted = pp.IsDiscounted,
                        DiscountPercentage = pp.DiscountPercentage,
                        DiscountedAmount = pp.DiscountedAmount,
                        WeightId = pp.WeightId,
                        WeightValue = pp.Weight?.Value,
                        WeightUnit = pp.Weight?.Unit,
                        SkuNumber = pp.SkuNumber,
                        Barcode = pp.Barcode,
                        IsActive = pp.IsActive,
                        IsDeleted = pp.IsDeleted
                    }).ToList()
                }).ToList();

                return productList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching products by category.", xCorrelationId, ex);
            }
        }

        public string SaveOrUpdateProduct(ProductRequestModel productReq, string xCorrelationId)
        {
            try
            {
                var productDetail = _dbContext.Products
                    .Include(p => p.ProductPrices)
                    .FirstOrDefault(x => x.Id == productReq.Id);

                bool isNew = false;

                if (productDetail == null)
                {
                    productDetail = new Model.EntityModel.Product
                    {
                        Id = Guid.NewGuid(),
                        CreatedDate = DateTime.UtcNow
                    };
                    isNew = true;
                }

                // Update main product fields
                productDetail.Name = productReq.Name;
                productDetail.Description = productReq.Description;
                productDetail.ManufacturingDate = productReq.ManufacturingDate;
                productDetail.ImageUrls = JsonSerializer.Serialize(productReq.ImageUrls);
                productDetail.KeyFeatures = JsonSerializer.Serialize(productReq.KeyFeatures);
                productDetail.Uses = JsonSerializer.Serialize(productReq.Uses);
                productDetail.CategoryId = productReq.CategoryId;
                productDetail.BrandId = productReq.BrandId;
                productDetail.MetaTitle = productReq.MetaTitle;
                productDetail.MetaDescription = productReq.MetaDescription;
                productDetail.Origin = productReq.Origin;
                productDetail.ShelfLife = productReq.ShelfLife;
                productDetail.StorageInstructions = productReq.StorageInstructions;
                productDetail.Certifications = JsonSerializer.Serialize(productReq.Certifications);
                productDetail.IsActive = productReq.IsActive;
                productDetail.IsPremium = productReq.IsPremium;
                productDetail.IsFeatured = productReq.IsFeatured;
                productDetail.Ingredients = productReq.Ingredients;
                productDetail.NutritionalInfo = productReq.NutritionalInfo;
                productDetail.ThumbnailUrl = productReq.ThumbnailUrl;
                productDetail.ModifiedDate = DateTime.UtcNow;

                if (isNew)
                {
                    _dbContext.Products.Add(productDetail);
                }

                // Handle Price Updates
                if (productReq.PricesAndSkus != null && productReq.PricesAndSkus.Any())
                {
                    // Remove existing prices for this product
                    if (productDetail.ProductPrices != null && productDetail.ProductPrices.Any())
                    {
                        _dbContext.ProductPrices.RemoveRange(productDetail.ProductPrices);
                    }

                    // Add new prices from request
                    foreach (var price in productReq.PricesAndSkus)
                    {
                        var newPrice = new ProductPrice
                        {
                            Id = Guid.NewGuid(),
                            ProductId = productDetail.Id,
                            Price = price.Price,
                            CurrencyId = price.CurrencyId,
                            IsDiscounted = price.IsDiscounted,
                            DiscountPercentage = price.DiscountPercentage,
                            DiscountedAmount = price.DiscountedAmount,
                            SkuNumber = price.SkuNumber,
                            WeightId = price.WeightId,
                            Barcode = price.Barcode,
                            IsActive = price.IsActive,
                            IsDeleted = price.IsDeleted,
                            CreatedDate = DateTime.UtcNow,
                            ModifiedDate = DateTime.UtcNow
                        };

                        _dbContext.ProductPrices.Add(newPrice);
                    }
                }

                _dbContext.SaveChanges();
                return productDetail.Id.ToString();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while saving/updating product.", xCorrelationId, ex);
            }
        }

        public string DeleteProductById(string id, string xCorrelationId)
        {
            try
            {
                Guid productId = Guid.Parse(id);

                var productDetail = _dbContext.Products
                    .Include(p => p.ProductPrices)
                    .FirstOrDefault(x => x.Id == productId && x.IsActive);

                if (productDetail != null)
                {
                    productDetail.IsActive = false;
                    productDetail.IsDeleted = true;
                    productDetail.ModifiedDate = DateTime.UtcNow;

                    foreach (var price in productDetail.ProductPrices)
                    {
                        price.IsActive = false;
                        price.IsDeleted = true;
                        price.ModifiedDate = DateTime.UtcNow;
                    }

                    _dbContext.Products.Update(productDetail);
                    _dbContext.SaveChanges();

                    return "Record deleted successfully.";
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while deleting product by Id.", xCorrelationId, ex);
            }
        }

        public List<CategoryResponseModel> GetCategories(string xCorrelationId)
        {
            try
            {
                List<CategoryResponseModel> categoryList = _dbContext.Categories.Select(x => new CategoryResponseModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    ImageUrl = x.ImageUrl,
                    BrandId = x.BrandId,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedDate = x.CreatedDate,
                    ModifiedDate = x.ModifiedDate,
                    MetaTitle = x.MetaTitle,
                    MetaDescription = x.MetaDescription
                }).ToList();

                return categoryList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while fetching categories", xCorrelationId, ex);
            }
        }

        public CategoryResponseModel GetCategoryById(string id, string xCorrelationId)
        {
            try
            {
                CategoryResponseModel category = _dbContext.Categories
                    .Where(x => x.Id == new Guid(id))
                    .Select(x => new CategoryResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        ImageUrl = x.ImageUrl,
                        BrandId = x.BrandId,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate,
                        MetaTitle = x.MetaTitle,
                        MetaDescription = x.MetaDescription
                    }).FirstOrDefault();

                return category;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while fetching category with Id {id}", xCorrelationId, ex);
            }
        }

        public string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId)
        {
            try
            {
                var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == category.Id);

                if (categoryDetail == null)
                {
                    categoryDetail = new()
                    {
                        Name = category.Name,
                        Description = category.Description,
                        ImageUrl = category.ImageUrl,
                        BrandId = category.BrandId,
                        CreatedDate = DateTime.UtcNow,
                        IsActive = category.IsActive,
                        MetaTitle = category.MetaTitle,
                        MetaDescription = category.MetaDescription
                    };

                    _dbContext.Categories.Add(categoryDetail);
                }
                else if (categoryDetail.Id == category.Id)
                {
                    categoryDetail.Name = category.Name;
                    categoryDetail.Description = category.Description;
                    categoryDetail.ImageUrl = category.ImageUrl;
                    categoryDetail.BrandId = category.BrandId;
                    categoryDetail.ModifiedDate = DateTime.UtcNow;
                    categoryDetail.IsActive = category.IsActive;
                    categoryDetail.MetaTitle = category.MetaTitle;
                    categoryDetail.MetaDescription = category.MetaDescription;

                    _dbContext.Categories.Update(categoryDetail);
                }

                _dbContext.SaveChanges();
                return categoryDetail.Id.ToString();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while saving or updating category", xCorrelationId, ex);
            }
        }

        public string DeleteCategoryById(string id, string xCorrelationId)
        {
            try
            {
                var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == new Guid(id));

                if (categoryDetail != null)
                {
                    categoryDetail.IsActive = false;
                    categoryDetail.IsDeleted = true;
                    categoryDetail.ModifiedDate = DateTime.UtcNow;

                    _dbContext.Categories.Update(categoryDetail);
                    _dbContext.SaveChanges();

                    return "Record deleted successfully.";
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while deleting category with Id {id}", xCorrelationId, ex);
            }
        }

        public List<BrandResponseModel> GetBrands(string xCorrelationId)
        {
            try
            {
                List<BrandResponseModel> brandList = _dbContext.Brands
                    .Where(x => x.IsActive)
                    .Select(x => new BrandResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Code,
                        Description = x.Description,
                        LogoUrl = x.LogoURL,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate,
                        MetaTitle = x.MetaTitle,
                        MetaDescription = x.MetaDescription
                    }).ToList();

                return brandList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while fetching brands", xCorrelationId, ex);
            }
        }

        public BrandResponseModel GetBrandById(string id, string xCorrelationId)
        {
            try
            {
                BrandResponseModel brandDetail = _dbContext.Brands
                    .Where(x => x.Id == new Guid(id))
                    .Select(x => new BrandResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Code,
                        Description = x.Description,
                        LogoUrl = x.LogoURL,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate,
                        MetaTitle = x.MetaTitle,
                        MetaDescription = x.MetaDescription
                    }).FirstOrDefault();

                return brandDetail;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while fetching brand with Id {id}", xCorrelationId, ex);
            }
        }

        public string SaveOrUpdateBrand(BrandRequestModel brandReq, string xCorrelationId)
        {
            try
            {
                var brandDetail = _dbContext.Brands.FirstOrDefault(x => x.Id == brandReq.Id);

                if (brandDetail == null)
                {
                    brandDetail = new()
                    {
                        Name = brandReq.Name,
                        Code = brandReq.Code,
                        Description = brandReq.Description,
                        LogoURL = brandReq.LogoUrl,
                        CreatedDate = DateTime.UtcNow,
                        IsActive = brandReq.IsActive,
                        MetaTitle = brandReq.MetaTitle,
                        MetaDescription = brandReq.MetaDescription
                    };

                    _dbContext.Brands.Add(brandDetail);
                }
                else if (brandDetail.Id == brandReq.Id)
                {
                    brandDetail.Name = brandReq.Name;
                    brandDetail.Code = brandReq.Code;
                    brandDetail.Description = brandReq.Description;
                    brandDetail.LogoURL = brandReq.LogoUrl;
                    brandDetail.ModifiedDate = DateTime.UtcNow;
                    brandDetail.IsActive = brandReq.IsActive;
                    brandDetail.MetaTitle = brandReq.MetaTitle;
                    brandDetail.MetaDescription = brandReq.MetaDescription;

                    _dbContext.Brands.Update(brandDetail);
                }

                _dbContext.SaveChanges();
                return brandDetail.Id.ToString();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while saving or updating brand", xCorrelationId, ex);
            }
        }

        public string DeleteBrandById(string id, string xCorrelationId)
        {
            try
            {
                var brandDetail = _dbContext.Brands.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

                if (brandDetail != null)
                {
                    brandDetail.IsActive = false;
                    brandDetail.IsDeleted = true;
                    brandDetail.ModifiedDate = DateTime.UtcNow;

                    _dbContext.Brands.Update(brandDetail);
                    _dbContext.SaveChanges();

                    return "Record deleted successfully.";
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while deleting brand with Id {id}", xCorrelationId, ex);
            }
        }

        public List<RoleResponseModel> GetRoles(string xCorrelationId)
        {
            try
            {
                List<RoleResponseModel> roleList = _dbContext.Roles
                    .Where(x => x.IsActive)
                    .Select(x => new RoleResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate
                    }).ToList();

                return roleList;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while fetching roles", xCorrelationId, ex);
            }
        }

        public RoleResponseModel GetRoleById(string id, string xCorrelationId)
        {
            try
            {
                RoleResponseModel roleDetail = _dbContext.Roles
                    .Where(x => x.Id == new Guid(id))
                    .Select(x => new RoleResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate
                    }).FirstOrDefault();

                return roleDetail;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while fetching role with Id {id}", xCorrelationId, ex);
            }
        }

        public string SaveOrUpdateRole(RoleRequestModel roleRequest, string xCorrelationId)
        {
            try
            {
                var roleDetail = _dbContext.Roles.FirstOrDefault(x => x.Id == roleRequest.Id);

                if (roleDetail == null)
                {
                    roleDetail = new()
                    {
                        Name = roleRequest.Name,
                        Description = roleRequest.Description,
                        CreatedDate = DateTime.UtcNow,
                        IsActive = roleRequest.IsActive
                    };

                    _dbContext.Roles.Add(roleDetail);
                }
                else if (roleDetail.Id == roleRequest.Id)
                {
                    roleDetail.Name = roleRequest.Name;
                    roleDetail.Description = roleRequest.Description;
                    roleDetail.ModifiedDate = DateTime.UtcNow;
                    roleDetail.IsActive = roleRequest.IsActive;

                    _dbContext.Roles.Update(roleDetail);
                }

                _dbContext.SaveChanges();
                return roleDetail.Id.ToString();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error while saving or updating role", xCorrelationId, ex);
            }
        }

        public string DeleteRoleById(string id, string xCorrelationId)
        {
            try
            {
                var roleDetail = _dbContext.Roles.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

                if (roleDetail != null)
                {
                    roleDetail.IsActive = false;
                    roleDetail.IsDeleted = true;
                    roleDetail.ModifiedDate = DateTime.UtcNow;

                    _dbContext.Roles.Update(roleDetail);
                    _dbContext.SaveChanges();

                    return "Record deleted successfully.";
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while deleting role with Id {id}", xCorrelationId, ex);
            }
        }

        public async Task<LoginResponseModel> UserLogin(LoginRequestModel model, string xCorrelationId)
        {
            try
            {
                var user = await Authenticate(model.Email, model.UserName, model.Password);
                if (user != null)
                {
                    return GenerateJwtToken(user);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred during user login", xCorrelationId, ex);
            }
        }

        public async Task<RegistrationResponseModel> UserRegistration(RegistrationRequestModel model, string xCorrelationId)
        {
            try
            {
                RegistrationResponseModel signupResponse = new();

                // Check if user already exists (without password validation, because new user shouldn't be verified by password)
                var userExists = await _dbContext.Users
                    .FirstOrDefaultAsync(u => (u.Email == model.Email || u.UserName == model.UserName) && u.IsActive);

                if (userExists == null)
                {
                    var user = new User
                    {
                        Email = model.Email,
                        UserName = model.UserName,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        MobileNumber = model.MobileNumber,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                        CreatedDate = DateTime.UtcNow,
                        IsActive = true,
                        RoleId = model.RoleId ?? Guid.Empty
                    };

                    _dbContext.Users.Add(user);
                    await _dbContext.SaveChangesAsync();

                    signupResponse.RegisteredId = user.Id.ToString();
                    signupResponse.Message = "User registered successfully";
                }
                else
                {
                    return null;
                }

                return signupResponse;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred during user registration", xCorrelationId, ex);
            }
        }

        private async Task<User> Authenticate(string email, string username, string password)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => (u.Email == email || u.UserName == username) && u.IsActive);

            if (user == null) return null;

            bool verified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return verified ? user : null;
        }

        private LoginResponseModel GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
        new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
    };

            var accessToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:AccessTokenExpiresInMinutes"])),
                signingCredentials: creds
            );

            var refreshToken = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["Jwt:RefreshTokenExpiresInMinutes"])),
                signingCredentials: creds
            );

            return new LoginResponseModel
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                RefreshToken = new JwtSecurityTokenHandler().WriteToken(refreshToken)
            };
        }

        public async Task<OrderResponseModel> CreateOrder(OrderRequestModel orderRequest, string xCorrelationId)
        {
            string razorpayOrderId = string.Empty;

            if (orderRequest.PaymentMethod?.ToUpper() == "RAZORPAY")
            {
                razorpayOrderId = _externalUtility.RazorPayCreateOrder(orderRequest.TotalAmount, orderRequest.Currency);
            }

            var order = new Model.EntityModel.Order
            {
                Id = Guid.NewGuid(),
                UserId = orderRequest.UserId,
                RazorpayOrderId = razorpayOrderId,
                TotalAmount = orderRequest.TotalAmount,
                Currency = orderRequest.Currency,
                Status = orderRequest.Status,
                ShippingAddressId = orderRequest.ShippingAddressId,
                BillingAddressId = orderRequest.BillingAddressId,
                CreatedDate = DateTime.UtcNow
            };

            foreach (var item in orderRequest.Items)
            {
                var orderItem = new OrderItem
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    CreatedDate = DateTime.UtcNow
                };

                order.OrderItems.Add(orderItem);
            }

            ////Send order placement email
            //string emailResponse = await SendOrderPlacementEmail(xCorrelationId);

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            return new OrderResponseModel
            {
                OrderId = order.Id,
                RazorpayOrderId = razorpayOrderId
            };
        }

        public async Task<bool> VerifyPayment(VerifyPaymentRequestModel verify, string xCorrelationId)
        {
            try
            {
                bool isVerify = _externalUtility.RazorPayVerifyPayment(verify.OrderId, verify.PaymentId, verify.Signature);
                if (!isVerify)
                    return false;

                var order = await _dbContext.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.RazorpayOrderId == verify.OrderId);

                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    UserId = verify.UserId,
                    RazorpayOrderId = verify.OrderId,
                    RazorpayPaymentId = verify.PaymentId,
                    Signature = verify.Signature,
                    TotalAmount = verify.TotalAmount,
                    Currency = verify.Currency,
                    Status = "Paid",
                    PaymentMethod = verify.PaymentMethod,
                    CreatedDate = DateTime.UtcNow
                };

                await _dbContext.Transactions.AddAsync(transaction);

                if (order != null)
                {
                    order.Status = "paid";
                    order.ModifiedDate = DateTime.UtcNow;

                    try
                    {
                        var shippingAddress = await _dbContext.Addresses
                            .FirstOrDefaultAsync(a => a.UserId == order.UserId && a.AddressType == "SHIPPING");

                        if (shippingAddress != null)
                        {
                            var defaultWeight = decimal.Parse(_configuration["PickupBooking:DefaultWeight"] ?? "0.5");
                            var totalWeight = order.OrderItems.Sum(oi => oi.Quantity * defaultWeight);
                            var totalPieces = order.OrderItems.Sum(oi => oi.Quantity);

                            var pickupBookingRequest = new PickupBookingRequestModel
                            {
                                SerialNo = Guid.NewGuid().ToString("N")[..10],
                                RefNo = order.ReceiptId ?? order.Id.ToString(),
                                ActionType = "Book",
                                ClientName = shippingAddress.FullName,
                                AddressLine1 = shippingAddress.AddressLine,
                                AddressLine2 = shippingAddress.LandMark,
                                City = shippingAddress.City,
                                PinCode = shippingAddress.PinCode,
                                MobileNo = shippingAddress.PhoneNumber,
                                Email = _configuration["PickupBooking:Email"],
                                DocType = "D",
                                TypeOfService = "Surface",
                                Weight = totalWeight.ToString("F2"),
                                InvoiceValue = order.TotalAmount.ToString("F2"),
                                NoOfPieces = totalPieces.ToString(),
                                ItemName = "DesiKing Premium Spices",
                                Remark = $"DesiKing Order: {order.ReceiptId}",
                                PickupCustName = _configuration["PickupBooking:CompanyName"],
                                PickupAddr = _configuration["PickupBooking:Address"],
                                PickupCity = _configuration["PickupBooking:City"],
                                PickupState = _configuration["PickupBooking:State"],
                                PickupPincode = _configuration["PickupBooking:PinCode"],
                                PickupPhone = _configuration["PickupBooking:Phone"],
                                ServiceType = _configuration["PickupBooking:DefaultServiceType"]
                            };

                            var pickupResult = await _externalUtility.CreatePickupBooking(pickupBookingRequest, xCorrelationId);

                            if (pickupResult != null && pickupResult.ErrorCode == 0)
                            {
                                var docketNo = pickupResult.Message.Split(':').LastOrDefault();
                                order.DocketNumber = docketNo;
                                order.ModifiedDate = DateTime.UtcNow;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error creating pickup booking for RazorpayOrderId: {RazorpayOrderId}", verify.OrderId);
                    }
                }

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred during payment verification", xCorrelationId, ex);
            }
        }

        public async Task<UserProfileResponseModel> GetUserProfile(Guid userId, string xCorrelationId)
        {
            var user = await _dbContext.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

            if (user == null)
            {
                return null; // caller can handle 404
            }

            return new UserProfileResponseModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                MobileNumber = user.MobileNumber,
                RoleId = user.RoleId,
                RoleName = user.Roles?.Name,
                CreatedDate = user.CreatedDate,
                ModifiedDate = user.ModifiedDate,
                BrandId = user.BrandId,
                IsActive = user.IsActive
            };
        }

        public async Task<RefundPaymentResponseModel> RefundPayment(RefundPaymentRequestModel refund, string xCorrelationId)
        {
            // Call Razorpay to initiate refund
            var refundPaymentResponse = _externalUtility.RazorPayRefundPayment(refund.PaymentId, refund.AmountInPaise);

            // Fetch existing transaction based on PaymentId
            var existingTransaction = await _dbContext.Transactions
                .FirstOrDefaultAsync(t => t.RazorpayPaymentId == refund.PaymentId);

            if (existingTransaction == null)
            {
                throw new Exception($"Transaction not found for PaymentId: {refund.PaymentId}");
            }

            // Create new refund entry
            var refundEntity = new RefundTransaction
            {
                Id = Guid.NewGuid(),
                RazorpayRefundId = refundPaymentResponse.RefundId,
                TransactionId = existingTransaction.Id,
                TotalAmount = refund.AmountInPaise / 100m, // convert paise → rupees
                Status = refundPaymentResponse.Status,
                CreatedDate = DateTime.UtcNow
            };

            _dbContext.RefundTransactions.Add(refundEntity);

            // Update transaction status if applicable
            if (refundPaymentResponse.Status == "processed" || refundPaymentResponse.Status == "succeeded")
            {
                // Calculate total refunded amount so far for this transaction
                var totalRefunded = await _dbContext.RefundTransactions
                    .Where(r => r.TransactionId == existingTransaction.Id)
                    .SumAsync(r => (decimal?)r.TotalAmount) ?? 0m;

                // Include current refund amount as well
                totalRefunded += refund.AmountInPaise / 100m;

                if (totalRefunded >= existingTransaction.TotalAmount)
                    existingTransaction.Status = "refunded";
                else if (totalRefunded > 0)
                    existingTransaction.Status = "partially_refunded";
            }

            await _dbContext.SaveChangesAsync();

            return refundPaymentResponse;
        }

        public List<CartResponseModel> GetCartItemsByUserId(string id, string xCorrelationId)
        {
            try
            {
                List<CartResponseModel> cartItemList = _dbContext.Carts
                    .Where(x => x.UserId == new Guid(id))
                    .Select(x => new CartResponseModel
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        ProductId = x.ProductId,
                        BrandId = x.BrandId,
                        Quantity = x.Quantity,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate
                    })
                    .ToList();

                return cartItemList;
            }
            catch (Exception ex)
            {
                // Wrap in RepositoryException with context
                throw new RepositoryException("Error occurred while fetching cart items ", xCorrelationId, ex);
            }
        }

        public string DeleteCartById(string id, string xCorrelationId)
        {
            try
            {
                var cartItem = _dbContext.Carts.FirstOrDefault(x => x.Id == new Guid(id));
                if (cartItem == null)
                {
                    return "Cart item not found or already inactive.";
                }

                _dbContext.Carts.Remove(cartItem);
                _dbContext.SaveChanges();

                return "Record deleted successfully.";
            }
            catch (Exception ex)
            {
                // Wrap in RepositoryException with context
                throw new RepositoryException("Error occurred while deleting cart item", xCorrelationId, ex);
            }
        }

        public string SaveOrUpdateCart(CartRequestModel cartRequest, string xCorrelationId)
        {
            var existingCartItem = _dbContext.Carts.FirstOrDefault(x =>
                x.UserId == cartRequest.UserId && x.ProductId == cartRequest.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity = cartRequest.Quantity;
                existingCartItem.ModifiedDate = DateTime.UtcNow;
                _dbContext.Carts.Update(existingCartItem);
                _dbContext.SaveChanges();
                return existingCartItem.Id.ToString();
            }
            else
            {
                var newCartItem = new Cart
                {
                    UserId = cartRequest.UserId,
                    ProductId = cartRequest.ProductId,
                    Quantity = cartRequest.Quantity,
                    BrandId = cartRequest.BrandId,
                    CreatedDate = DateTime.UtcNow
                };

                _dbContext.Carts.Add(newCartItem);
                _dbContext.SaveChanges();
                return newCartItem.Id.ToString();
            }
        }

        public List<CurrencyResponseModel> GetCurrencies(string xCorrelationId)
        {
            try
            {
                return _dbContext.Currencies
                    .Where(x => x.IsActive)
                    .Select(x => new CurrencyResponseModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Code = x.Code,
                        IsDefault = x.IsDefault,
                        IsActive = x.IsActive,
                        IsDeleted = x.IsDeleted,
                        CreatedDate = x.CreatedDate,
                        ModifiedDate = x.ModifiedDate
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching active currencies.", xCorrelationId, ex);
            }
        }

        public List<WeightResponseModel> GetWeights(string xCorrelationId)
        {
            try
            {
                return _dbContext.Weights
                    .Select(x => new WeightResponseModel
                    {
                        Id = x.Id,
                        Value = x.Value,
                        Unit = x.Unit
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching weights.", xCorrelationId, ex);
            }
        }

        public async Task<List<StateResponseModel>> GetStates(string countryCode, string xCorrelationId)
        {
            try
            {
                return await _dbContext.StateMasters
                    .Where(x => x.CountryCode == countryCode.ToUpperInvariant())
                    .Select(s => new StateResponseModel
                    {
                        StateCode = s.StateCode,
                        StateName = s.StateName,
                        CountryCode = s.CountryCode
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching states.", xCorrelationId, ex);
            }
        }

        public async Task<List<CountryResponseModel>> GetCountries(string xCorrelationId)
        {
            try
            {
                return await _dbContext.CountryMasters
                    .Select(c => new CountryResponseModel
                    {
                        CountryCode = c.CountryCode,
                        CountryName = c.CountryName
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching countries.", xCorrelationId, ex);
            }
        }

        private async Task<string> SendOrderPlacementEmail(string xCorrelationId)
        {
            try
            {
                string to = "hkv1295@gmail.com";
                string subject = "Your Order Has Shipped!";
                string body = "Hi there, your order is on its way!";

                await _externalUtility.SendEmailAsync(to, subject, body);
                return "Email Sent";
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while sending order placement email.", xCorrelationId, ex);
            }
        }


        public List<AddressResponseModel> GetAddressesByUserId(string id, string xCorrelationId)
        {
            try
            {
                Guid userGuid = Guid.Parse(id);

                var addresses = (from a in _dbContext.Addresses
                                 join s in _dbContext.StateMasters on a.StateCode equals s.StateCode into stateJoin
                                 from s in stateJoin.DefaultIfEmpty()
                                 join c in _dbContext.CountryMasters on a.CountryCode equals c.CountryCode into countryJoin
                                 from c in countryJoin.DefaultIfEmpty()
                                 where a.UserId == userGuid && !a.IsDeleted
                                 select new AddressResponseModel
                                 {
                                     Id = a.Id,
                                     UserId = a.UserId,
                                     FullAddress =
                                         a.AddressLine + ", " +
                                         a.City + ", " +
                                         (s != null ? s.StateName : a.StateCode) + ", " +
                                         (c != null ? c.CountryName : a.CountryCode) + " - " +
                                         a.PinCode
                                 })
                                .ToList();

                return addresses;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching addresses", xCorrelationId, ex);
            }
        }


        public string SaveOrUpdateAddress(AddressRequestModel request, string xCorrelationId)
        {
            try
            {
                var existingAddress = _dbContext.Addresses
                    .FirstOrDefault(x => x.Id == request.Id);

                if (existingAddress != null)
                {
                    existingAddress.FullName = request.FullName;
                    existingAddress.PhoneNumber = request.PhoneNumber;
                    existingAddress.AddressLine = request.AddressLine;
                    existingAddress.LandMark = request.LandMark;
                    existingAddress.City = request.City;
                    existingAddress.PinCode = request.PinCode;
                    existingAddress.StateCode = request.StateCode;
                    existingAddress.CountryCode = request.CountryCode;
                    existingAddress.AddressType = request.AddressType;
                    existingAddress.IsActive = request.IsActive;
                    existingAddress.IsDeleted = request.IsDeleted;
                    existingAddress.ModifiedDate = DateTime.UtcNow;

                    _dbContext.Addresses.Update(existingAddress);
                    _dbContext.SaveChanges();

                    return existingAddress.Id.ToString();
                }
                else
                {
                    var newAddress = new Address
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        FullName = request.FullName,
                        PhoneNumber = request.PhoneNumber,
                        AddressLine = request.AddressLine,
                        City = request.City,
                        PinCode = request.PinCode,
                        StateCode = request.StateCode,
                        CountryCode = request.CountryCode,
                        AddressType = request.AddressType,
                        IsActive = request.IsActive,
                        IsDeleted = request.IsDeleted,
                        CreatedDate = DateTime.UtcNow
                    };

                    _dbContext.Addresses.Add(newAddress);
                    _dbContext.SaveChanges();

                    return newAddress.Id.ToString();
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while saving/updating address", xCorrelationId, ex);
            }
        }

        public string DeleteAddressById(string id, string xCorrelationId)
        {
            try
            {
                var entity = _dbContext.Addresses.FirstOrDefault(x => x.Id == new Guid(id));
                if (entity == null)
                {
                    return "Address not found or already inactive.";
                }

                _dbContext.Addresses.Remove(entity);
                _dbContext.SaveChanges();

                return "Record deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while deleting address", xCorrelationId, ex);
            }
        }
        public List<OrderByUserResponseModel> GetOrdersByUserId(string userId, string xCorrelationId)
        {
            try
            {
                Guid userGuid = Guid.Parse(userId);

                var orders = _dbContext.Orders
                    .Where(o => o.UserId == userGuid)
                    .OrderByDescending(o => o.CreatedDate)
                    .Select(o => new OrderByUserResponseModel
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        RazorpayOrderId = o.RazorpayOrderId,
                        ReceiptId = o.ReceiptId,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        Currency = o.Currency,
                        CreatedDate = o.CreatedDate,
                        DocketNumber = o.DocketNumber,

                        OrderItems = o.OrderItems
                            .OrderByDescending(oi => oi.CreatedDate)
                            .Select(oi => new OrderItemResponseModel
                            {
                                Id = oi.Id,
                                OrderId = oi.OrderId,
                                ProductId = oi.ProductId,
                                Quantity = oi.Quantity,
                                Price = oi.Price,
                                CreatedDate = oi.CreatedDate
                            })
                            .ToList(),

                        Transaction = _dbContext.Transactions
                            .Where(t => t.RazorpayOrderId == o.RazorpayOrderId)
                            .Select(t => new TransactionResponseModel
                            {
                                Id = t.Id,
                                RazorpayPaymentId = t.RazorpayPaymentId,
                                RazorpayOrderId = t.RazorpayOrderId,
                                UserId = t.UserId,
                                Signature = t.Signature,
                                TotalAmount = t.TotalAmount,
                                Currency = t.Currency,
                                Status = t.Status,
                                PaymentMethod = t.PaymentMethod,
                                BrandId = t.BrandId,
                                PaidAt = t.PaidAt,
                                CreatedDate = t.CreatedDate
                            })
                            .FirstOrDefault(),

                        ShippingAddress = _dbContext.Addresses
                            .Where(a => a.Id == o.ShippingAddressId && a.IsDeleted == false)
                            .Select(a => new DetailedAddressResponseModel
                            {
                                Id = a.Id,
                                UserId = a.UserId,
                                FullName = a.FullName,
                                PhoneNumber = a.PhoneNumber,
                                AddressLine = a.AddressLine,
                                City = a.City,
                                LandMark = a.LandMark,
                                PinCode = a.PinCode,
                                StateCode = a.StateCode,
                                CountryCode = a.CountryCode,
                                AddressType = a.AddressType,
                                CreatedDate = a.CreatedDate
                            })
                            .FirstOrDefault(),

                        BillingAddress = _dbContext.Addresses
                            .Where(a => a.Id == o.BillingAddressId && a.IsDeleted == false)
                            .Select(a => new DetailedAddressResponseModel
                            {
                                Id = a.Id,
                                UserId = a.UserId,
                                FullName = a.FullName,
                                PhoneNumber = a.PhoneNumber,
                                AddressLine = a.AddressLine,
                                City = a.City,
                                LandMark = a.LandMark,
                                PinCode = a.PinCode,
                                StateCode = a.StateCode,
                                CountryCode = a.CountryCode,
                                AddressType = a.AddressType,
                                CreatedDate = a.CreatedDate
                            })
                            .FirstOrDefault()
                    })
                    .ToList();

                return orders;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching orders by user id", xCorrelationId, ex);
            }
        }

        public OrderByUserResponseModel GetOrderId(string orderId, string xCorrelationId)
        {
            try
            {
                Guid orderGuid = Guid.Parse(orderId);

                var order = _dbContext.Orders
                    .Where(o => o.Id == orderGuid)
                    .Select(o => new OrderByUserResponseModel
                    {
                        Id = o.Id,
                        UserId = o.UserId,
                        RazorpayOrderId = o.RazorpayOrderId,
                        ReceiptId = o.ReceiptId,
                        Status = o.Status,
                        TotalAmount = o.TotalAmount,
                        Currency = o.Currency,
                        CreatedDate = o.CreatedDate,
                        DocketNumber = o.DocketNumber,

                        OrderItems = o.OrderItems
                            .OrderByDescending(oi => oi.CreatedDate)
                            .Select(oi => new OrderItemResponseModel
                            {
                                Id = oi.Id,
                                OrderId = oi.OrderId,
                                ProductId = oi.ProductId,
                                Quantity = oi.Quantity,
                                Price = oi.Price,
                                CreatedDate = oi.CreatedDate
                            })
                            .ToList(),

                        Transaction = _dbContext.Transactions
                            .Where(t => t.RazorpayOrderId == o.RazorpayOrderId)
                            .Select(t => new TransactionResponseModel
                            {
                                Id = t.Id,
                                RazorpayPaymentId = t.RazorpayPaymentId,
                                RazorpayOrderId = t.RazorpayOrderId,
                                UserId = t.UserId,
                                Signature = t.Signature,
                                TotalAmount = t.TotalAmount,
                                Currency = t.Currency,
                                Status = t.Status,
                                PaymentMethod = t.PaymentMethod,
                                BrandId = t.BrandId,
                                PaidAt = t.PaidAt,
                                CreatedDate = t.CreatedDate
                            })
                            .FirstOrDefault(),

                        ShippingAddress = _dbContext.Addresses
                            .Where(a => a.Id == o.ShippingAddressId && a.IsDeleted == false)
                            .Select(a => new DetailedAddressResponseModel
                            {
                                Id = a.Id,
                                UserId = a.UserId,
                                FullName = a.FullName,
                                PhoneNumber = a.PhoneNumber,
                                AddressLine = a.AddressLine,
                                City = a.City,
                                LandMark = a.LandMark,
                                PinCode = a.PinCode,
                                StateCode = a.StateCode,
                                CountryCode = a.CountryCode,
                                AddressType = a.AddressType,
                                CreatedDate = a.CreatedDate
                            })
                            .FirstOrDefault(),

                        BillingAddress = _dbContext.Addresses
                            .Where(a => a.Id == o.BillingAddressId && a.IsDeleted == false)
                            .Select(a => new DetailedAddressResponseModel
                            {
                                Id = a.Id,
                                UserId = a.UserId,
                                FullName = a.FullName,
                                PhoneNumber = a.PhoneNumber,
                                AddressLine = a.AddressLine,
                                City = a.City,
                                LandMark = a.LandMark,
                                PinCode = a.PinCode,
                                StateCode = a.StateCode,
                                CountryCode = a.CountryCode,
                                AddressType = a.AddressType,
                                CreatedDate = a.CreatedDate
                            })
                            .FirstOrDefault()
                    })
                    .FirstOrDefault();

                return order;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while fetching order by order id", xCorrelationId, ex);
            }
        }

        public async Task<AnalyticsResponseModel> ProcessAnalyticsEvents(AnalyticsPayloadRequest payload, string xCorrelationId)
        {
            try
            {
                var response = new AnalyticsResponseModel
                {
                    Success = true,
                    Message = "Analytics events processed successfully",
                    ProcessedEvents = 0,
                    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };

                if (payload?.Events?.Any() == true)
                {
                    foreach (var eventData in payload.Events)
                    {
                        // Create analytics event
                        var analyticsEvent = new AnalyticsEvent
                        {
                            EventName = eventData.Event,
                            Category = eventData.Category,
                            Action = eventData.Action,
                            Label = eventData.Label,
                            Value = eventData.Value,
                            Timestamp = eventData.Timestamp,
                            EventDate = DateTime.UtcNow,
                            SessionId = eventData.SessionId,
                            UserId = eventData.UserId,
                            CustomData = eventData.CustomData != null ? JsonSerializer.Serialize(eventData.CustomData) : null,
                            UserAgent = payload.UserAgent,
                            PageUrl = payload.Url,
                            ReferrerUrl = eventData.PageReferrer,

                            // Enhanced User and Location Details
                            IpAddress = payload.IpAddress,
                            Country = payload.Country,
                            Region = payload.Region,
                            City = payload.City,
                            TimeZone = payload.TimeZone,
                            Language = payload.Language,

                            // Device, Session, and User Profile Info (stored as JSON)
                            DeviceInfo = payload.DeviceInfo != null ? JsonSerializer.Serialize(payload.DeviceInfo) : null,
                            SessionInfo = payload.SessionInfo != null ? JsonSerializer.Serialize(payload.SessionInfo) : null,
                            UserProfileInfo = payload.UserProfile != null ? JsonSerializer.Serialize(payload.UserProfile) : null,

                            // Enhanced Event Context
                            PageReferrer = eventData.PageReferrer,
                            ScrollDepth = eventData.ScrollDepth,
                            TimeOnPage = eventData.TimeOnPage,
                            InteractionTarget = eventData.InteractionTarget,
                            EventSource = eventData.EventSource,
                            ElementAttributes = eventData.ElementAttributes != null ? JsonSerializer.Serialize(eventData.ElementAttributes) : null,
                            PerformanceData = eventData.PerformanceData != null ? JsonSerializer.Serialize(eventData.PerformanceData) : null,

                            CreatedAt = DateTime.UtcNow
                        };

                        _dbContext.AnalyticsEvents.Add(analyticsEvent);
                        await _dbContext.SaveChangesAsync(); // Save to get the ID

                        // Handle ecommerce events
                        if (!string.IsNullOrEmpty(eventData.TransactionId) || eventData.Items?.Any() == true)
                        {
                            var ecommerceEvent = new EcommerceEvent
                            {
                                AnalyticsEventId = analyticsEvent.Id,
                                TransactionId = eventData.TransactionId,
                                Currency = eventData.Currency,
                                TotalValue = eventData.Value,
                                ItemsData = eventData.Items != null ? JsonSerializer.Serialize(eventData.Items) : null,
                                CreatedAt = DateTime.UtcNow
                            };

                            _dbContext.EcommerceEvents.Add(ecommerceEvent);
                        }

                        response.ProcessedEvents++;
                    }

                    await _dbContext.SaveChangesAsync();
                }

                return response;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while processing analytics events", xCorrelationId, ex);
            }
        }

        public async Task<UserProfileResponseModel> UpdateUserProfile(RegistrationRequestModel model, string xCorrelationId)
        {
            try
            {
                // For profile updates, Id should be provided
                if (!model.Id.HasValue)
                {
                    throw new RepositoryException("User ID is required for profile updates", xCorrelationId);
                }

                var user = await _dbContext.Users
                    .Include(u => u.Roles)
                    .FirstOrDefaultAsync(u => u.Id == model.Id.Value && u.IsActive && !u.IsDeleted);

                if (user == null)
                {
                    throw new RepositoryException("User not found", xCorrelationId);
                }

                // Update user properties
                user.FirstName = model.FirstName?.Trim();
                user.LastName = model.LastName?.Trim();
                user.Email = model.Email?.Trim();
                user.MobileNumber = model.MobileNumber?.Trim();
                user.ModifiedDate = DateTime.UtcNow;

                // Update username if provided, otherwise use email
                user.UserName = !string.IsNullOrWhiteSpace(model.UserName)
                    ? model.UserName.Trim()
                    : model.Email?.Trim();

                await _dbContext.SaveChangesAsync();

                // Return updated profile
                return new UserProfileResponseModel
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    MobileNumber = user.MobileNumber,
                    RoleId = user.RoleId,
                    RoleName = user.Roles?.Name,
                    CreatedDate = user.CreatedDate,
                    ModifiedDate = user.ModifiedDate,
                    BrandId = user.BrandId,
                    IsActive = user.IsActive
                };
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Error occurred while updating user profile", xCorrelationId, ex);
            }
        }

        public async Task<ShipmentTrackingResponseModel> TrackShipment(string awbNo, string xCorrelationId)
        {
            try
            {
                // Fetch credentials from appsettings.json
                var appKey = _configuration["Trackon:AppKey"];
                var userId = _configuration["Trackon:UserId"];
                var password = _configuration["Trackon:Password"];
                var baseUrl = _configuration["Trackon:TrackingUrl"] ?? "http://trackoncourier.com:5455/CrmApi/t1/AWBTrackingCustomer";

                if (string.IsNullOrWhiteSpace(appKey) || string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(password))
                    throw new RepositoryException("Trackon API credentials missing.", xCorrelationId);

                var requestUrl = $"{baseUrl}?AWBNo={awbNo}&AppKey={appKey}&userID={userId}&Password={password}";

                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                var response = await httpClient.GetAsync(requestUrl);

                if (!response.IsSuccessStatusCode)
                    throw new RepositoryException($"Trackon API returned {response.StatusCode}", xCorrelationId);

                var json = await response.Content.ReadAsStringAsync();

                var trackingResult = JsonSerializer.Deserialize<ShipmentTrackingResponseModel>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (trackingResult == null)
                    throw new RepositoryException("Invalid or empty response from Trackon API.", xCorrelationId);

                return trackingResult;
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while fetching shipment tracking for AWB: {awbNo}", xCorrelationId, ex);
            }
        }

        public async Task<ShipmentLabelResponseModel> GenerateShipmentLabel(string awbNo, string xCorrelationId)
        {
            ShipmentLabelResponseModel shipmentLabelResponse = new();
            try
            {
                shipmentLabelResponse = await _externalUtility.GenerateShipmentLabel(awbNo, xCorrelationId);
            }
            catch (Exception ex)
            {
                throw new RepositoryException($"Error while generating shipment label for AWB: {awbNo}", xCorrelationId, ex);
            }
            return shipmentLabelResponse;
        }

        public async Task<byte[]> GenerateInvoicePdf(GenerateInvoiceRequestModel invoiceData, string xCorrelationId)
        {
            // Step 1: Validate invoice data
            var validationErrors = ValidateInvoiceData(invoiceData.InvoiceData);
            if (validationErrors.Any())
            {
                throw new Exception("Invoice validation failed: " + string.Join("; ", validationErrors));
            }

            // Step 2: Generate the HTML for the invoice
            var htmlContent = GenerateInvoiceHtml(invoiceData);

            // Step 3: Try DinkToPdf first if available, otherwise use PuppeteerSharp
            if (_pdfConverter != null)
            {
                try
                {
                    _logger.LogInformation("Attempting PDF generation with DinkToPdf for xCorrelationId: {CorrelationId}", xCorrelationId);
                    
                    var globalSettings = new GlobalSettings
                    {
                        ColorMode = ColorMode.Color,
                        Orientation = Orientation.Portrait,
                        PaperSize = PaperKind.A4,
                        Margins = new MarginSettings
                        {
                            Top = 10,
                            Bottom = 10,
                            Left = 10,
                            Right = 10
                        },
                        DocumentTitle = $"Invoice_{invoiceData.InvoiceData.Invoice.Number}",
                        DPI = 300
                    };

                    var objectSettings = new ObjectSettings
                    {
                        PagesCount = true,
                        HtmlContent = htmlContent,
                        WebSettings = new WebSettings
                        {
                            DefaultEncoding = "utf-8",
                            PrintMediaType = true,
                            EnableJavascript = true,
                            LoadImages = true
                        },
                        HeaderSettings = new HeaderSettings
                        {
                            FontSize = 8,
                            Right = "Page [page] of [toPage]",
                            Line = false
                        },
                        FooterSettings = new FooterSettings
                        {
                            FontSize = 8,
                            Center = "Generated by Agronexis",
                            Line = true
                        }
                    };

                    var pdfDoc = new HtmlToPdfDocument
                    {
                        GlobalSettings = globalSettings,
                        Objects = { objectSettings }
                    };

                    var pdfBytes = _pdfConverter.Convert(pdfDoc);
                    _logger.LogInformation("Invoice PDF generated successfully using DinkToPdf for xCorrelationId: {CorrelationId}", xCorrelationId);
                    return await Task.FromResult(pdfBytes);
                }
                catch (Exception dinkToPdfEx)
                {
                    _logger.LogWarning(dinkToPdfEx, "DinkToPdf failed, falling back to PuppeteerSharp for xCorrelationId: {CorrelationId}", xCorrelationId);
                }
            }
            else
            {
                _logger.LogInformation("DinkToPdf not available, using PuppeteerSharp for xCorrelationId: {CorrelationId}", xCorrelationId);
            }

            // Fallback to PuppeteerSharp
            return await GenerateInvoicePdfWithPuppeteer(invoiceData, xCorrelationId);
        }

        private async Task<byte[]> GenerateInvoicePdfWithPuppeteer(GenerateInvoiceRequestModel invoiceData, string xCorrelationId)
        {
            try
            {
                _logger.LogInformation("Using PuppeteerSharp for invoice generation, xCorrelationId: {CorrelationId}", xCorrelationId);

                // Ensure Puppeteer downloads Chromium if not already present
                var browserFetcher = new BrowserFetcher();
                var installedBrowser = await browserFetcher.DownloadAsync();
                _logger.LogInformation("Chromium path: {ChromiumPath}", installedBrowser.GetExecutablePath());

                // Production-optimized launch configuration
                var launchOptions = new LaunchOptions
                {
                    Headless = true,
                    ExecutablePath = installedBrowser.GetExecutablePath(),
                    Args = new[]
                    {
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--disable-extensions",
                        "--disable-web-security",
                        "--allow-running-insecure-content",
                        "--disable-features=VizDisplayCompositor"
                    },
                    IgnoreHTTPSErrors = true,
                    DefaultViewport = new ViewPortOptions
                    {
                        Width = 1280,
                        Height = 800
                    },
                    Timeout = 60000 // 60 seconds
                };

                IBrowser browser = null;
                IPage page = null;

                try
                {
                    _logger.LogInformation("Launching Chromium browser for invoice generation, xCorrelationId: {CorrelationId}", xCorrelationId);
                    browser = await Puppeteer.LaunchAsync(launchOptions);

                    page = await browser.NewPageAsync();

                    // Generate HTML content
                    var htmlContent = GenerateInvoiceHtml(invoiceData);

                    // Load HTML content and wait for rendering to complete
                    await page.SetContentAsync(htmlContent, new PuppeteerSharp.NavigationOptions
                    {
                        WaitUntil = new[] { WaitUntilNavigation.Load, WaitUntilNavigation.DOMContentLoaded }
                    });

                    // Wait for fonts and images to load
                    await page.WaitForTimeoutAsync(3000);

                    _logger.LogInformation("Generating PDF using PuppeteerSharp, xCorrelationId: {CorrelationId}", xCorrelationId);

                    var pdfBytes = await page.PdfDataAsync(new PdfOptions
                    {
                        Format = PuppeteerSharp.Media.PaperFormat.A4,
                        PrintBackground = true,
                        MarginOptions = new PuppeteerSharp.Media.MarginOptions
                        {
                            Top = "10mm",
                            Right = "10mm",
                            Bottom = "10mm",
                            Left = "10mm"
                        },
                        HeaderTemplate = "<span style='font-size: 10px; color: #666; margin-left: 20px;'>Generated by Agronexis</span>",
                        FooterTemplate = "<span style='font-size: 10px; color: #666; margin-left: 20px;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></span>",
                        DisplayHeaderFooter = true
                    });

                    _logger.LogInformation("Invoice PDF generated successfully using PuppeteerSharp, size: {Size} bytes, xCorrelationId: {CorrelationId}", pdfBytes.Length, xCorrelationId);
                    return pdfBytes;
                }
                finally
                {
                    if (page != null && !page.IsClosed)
                    {
                        await page.CloseAsync();
                        _logger.LogDebug("Page closed, xCorrelationId: {CorrelationId}", xCorrelationId);
                    }

                    if (browser != null && !browser.IsClosed)
                    {
                        await browser.CloseAsync();
                        _logger.LogDebug("Browser closed, xCorrelationId: {CorrelationId}", xCorrelationId);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PuppeteerSharp failed for invoice generation, xCorrelationId: {CorrelationId}", xCorrelationId);
                throw new Exception($"PDF generation failed: {ex.Message}", ex);
            }
        }
        private List<string> ValidateInvoiceData(InvoiceDataModel invoiceData)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(invoiceData.Supplier?.Name))
                errors.Add("Supplier name is required");
            if (string.IsNullOrEmpty(invoiceData.Supplier?.Gstin))
                errors.Add("Supplier GSTIN is required");
            if (string.IsNullOrEmpty(invoiceData.Supplier?.Address))
                errors.Add("Supplier address is required");

            if (string.IsNullOrEmpty(invoiceData.Invoice?.Number))
                errors.Add("Invoice number is required");
            if (string.IsNullOrEmpty(invoiceData.Invoice?.Date))
                errors.Add("Invoice date is required");

            if (string.IsNullOrEmpty(invoiceData.Customer?.Name))
                errors.Add("Customer name is required");
            if (string.IsNullOrEmpty(invoiceData.Customer?.Address))
                errors.Add("Customer address is required");
            if (string.IsNullOrEmpty(invoiceData.Customer?.StateCode))
                errors.Add("Customer state code is required for GST compliance");

            if (invoiceData.Items == null || !invoiceData.Items.Any())
                errors.Add("At least one invoice item is required");
            else
            {
                for (int i = 0; i < invoiceData.Items.Count; i++)
                {
                    var item = invoiceData.Items[i];
                    if (string.IsNullOrEmpty(item.Description))
                        errors.Add($"Item {i + 1}: Description is required");
                    if (string.IsNullOrEmpty(item.HsnCode))
                        errors.Add($"Item {i + 1}: HSN code is required for GST compliance");
                    if (item.Quantity <= 0)
                        errors.Add($"Item {i + 1}: Quantity must be greater than 0");
                    if (item.Rate <= 0)
                        errors.Add($"Item {i + 1}: Rate must be greater than 0");
                }
            }

            if (invoiceData.TaxSummary == null || string.IsNullOrEmpty(invoiceData.TaxSummary.PlaceOfSupply))
                errors.Add("Place of supply is required for GST compliance");

            return errors;
        }
        private string GenerateInvoiceHtml(GenerateInvoiceRequestModel request)
        {
            var invoiceData = request.InvoiceData;
            var html = new StringBuilder();

            html.Append(@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>GST Invoice</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .invoice-container { max-width: 1200px; margin: 0 auto; padding: 20px; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .company-info h1 { font-size: 28px; margin-bottom: 10px; }
        .company-info p { margin-bottom: 5px; opacity: 0.9; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 32px; margin-bottom: 5px; }
        .invoice-details { background: #f8f9fa; padding: 25px; border-left: 5px solid #667eea; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .detail-section h3 { color: #667eea; margin-bottom: 15px; font-size: 18px; }
        .detail-item { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .detail-label { font-weight: 600; color: #495057; }
        .addresses-section { margin: 30px 0; }
        .addresses-header { background: #667eea; color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: 600; }
        .addresses-content { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .address-box { padding: 25px; border: 1px solid #dee2e6; background: #fff; }
        .address-box:first-child { border-right: none; }
        .address-title { font-weight: 700; color: #667eea; margin-bottom: 15px; font-size: 16px; }
        .address-box div { margin-bottom: 8px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .items-table th { background: #667eea; color: white; padding: 15px 10px; text-align: center; font-weight: 600; }
        .items-table td { padding: 12px 10px; border: 1px solid #dee2e6; text-align: center; }
        .items-table tbody tr:nth-child(even) { background-color: #f8f9fa; }
        .items-table tbody tr:hover { background-color: #e9ecef; }
        .text-left { text-align: left !important; }
        .text-right { text-align: right !important; }
        .tax-summary { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; }
        .tax-summary h3 { color: #667eea; margin-bottom: 20px; }
        .tax-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .tax-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; }
        .total-amount { background: #667eea; color: white; padding: 15px; border-radius: 5px; margin-top: 15px; }
        .total-amount .amount { font-size: 24px; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; border-top: 2px solid #667eea; color: #6c757d; }
        .signature-section { margin: 40px 0; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 10px; }
        .terms { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .terms h4 { color: #856404; margin-bottom: 10px; }
        .e-invoice-section { background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 5px; margin: 20px 0; }
        @media print { .invoice-container { max-width: none; padding: 0; } }
    </style>
</head>
<body>
    <div class='invoice-container'>
        <!-- Header -->
        <div class='header'>
            <div class='header-content'>
                <div class='company-info'>
                    <h1>" + invoiceData.Supplier.Name + @"</h1>
                    <p>" + invoiceData.Supplier.Address + @"</p>
                    <p>GSTIN: " + invoiceData.Supplier.Gstin + @" | PAN: " + (invoiceData.Supplier.PanNumber ?? "N/A") + @"</p>
                    <p>📧 " + (invoiceData.Supplier.Email ?? "N/A") + @" | 📞 " + (invoiceData.Supplier.Phone ?? "N/A") + @"</p>
                </div>
                <div class='invoice-title'>
                    <h2>TAX INVOICE</h2>
                    <p>GST Compliant</p>
                </div>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class='invoice-details'>
            <div class='details-grid'>
                <div class='detail-section'>
                    <h3>Invoice Information</h3>
                    <div class='detail-item'><span class='detail-label'>Invoice No:</span><span>" + invoiceData.Invoice.Number + @"</span></div>
                    <div class='detail-item'><span class='detail-label'>Invoice Date:</span><span>" + invoiceData.Invoice.Date + @"</span></div>
                    <div class='detail-item'><span class='detail-label'>Due Date:</span><span>" + (invoiceData.Invoice.DueDate ?? "N/A") + @"</span></div>
                    <div class='detail-item'><span class='detail-label'>Financial Year:</span><span>" + (invoiceData.Invoice.FinancialYear ?? "N/A") + @"</span></div>
                </div>
                <div class='detail-section'>
                    <h3>Order Information</h3>
                    <div class='detail-item'><span class='detail-label'>Order No:</span><span>" + (invoiceData.Invoice.OrderNumber ?? "N/A") + @"</span></div>
                    <div class='detail-item'><span class='detail-label'>Order Date:</span><span>" + (invoiceData.Invoice.OrderDate ?? "N/A") + @"</span></div>
                    <div class='detail-item'><span class='detail-label'>Place of Supply:</span><span>" + (invoiceData.TaxSummary?.PlaceOfSupply ?? "N/A") + @"</span></div>
                </div>
            </div>
        </div>

        <!-- Addresses -->
        <div class='addresses-section'>
            <div class='addresses-header'>Bill To & Ship To</div>
            <div class='addresses-content'>
                <div class='address-box'>
                    <div class='address-title'>🏢 Bill To (Customer Details)</div>
                    <div><strong>" + invoiceData.Customer.Name + @"</strong></div>
                    <div>" + invoiceData.Customer.Address + @"</div>
                    <div>" + (invoiceData.Customer.City ?? "N/A") + @", " + (invoiceData.Customer.State ?? "N/A") + @" - " + (invoiceData.Customer.Pincode ?? "N/A") + @"</div>
                    <div>📞 " + (invoiceData.Customer.Phone ?? "N/A") + @"</div>");

            if (!string.IsNullOrEmpty(invoiceData.Customer.Email))
                html.Append($@"<div>📧 {invoiceData.Customer.Email}</div>");

            if (!string.IsNullOrEmpty(invoiceData.Customer.Gstin))
                html.Append($@"<div><strong>GSTIN:</strong> {invoiceData.Customer.Gstin}</div>");

            html.Append($@"<div><strong>State Code:</strong> {invoiceData.Customer.StateCode ?? "N/A"}</div>
                </div>
                <div class='address-box'>
                    <div class='address-title'>🚚 Ship To</div>");

            if (invoiceData.DeliveryAddress != null)
            {
                html.Append($@"
                    <div><strong>{invoiceData.DeliveryAddress.Name}</strong></div>
                    <div>{invoiceData.DeliveryAddress.Address}</div>
                    <div>{invoiceData.DeliveryAddress.City}, {invoiceData.DeliveryAddress.State} - {invoiceData.DeliveryAddress.Pincode}</div>
                    <div>📞 {invoiceData.DeliveryAddress.Phone}</div>
                    <div><strong>State Code:</strong> {invoiceData.DeliveryAddress.StateCode}</div>");
            }
            else
            {
                html.Append(@"<div style='color: #666; font-style: italic;'>Same as billing address</div>");
            }

            html.Append(@"
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <table class='items-table'>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Description</th>
                    <th>HSN Code</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Taxable Value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>");

            if (invoiceData.Items != null && invoiceData.Items.Any())
            {
                foreach (var item in invoiceData.Items)
                {
                    html.Append($@"
                <tr>
                    <td>{item.SlNo}</td>
                    <td class='text-left'>{item.Description}</td>
                    <td>{item.HsnCode}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.Unit ?? "Nos"}</td>
                    <td class='text-right'>₹{item.Rate:F2}</td>
                    <td class='text-right'>₹{item.TaxableValue:F2}</td>
                    <td>{item.CgstRate:F1}%</td>
                    <td>{item.SgstRate:F1}%</td>
                    <td>{item.IgstRate:F1}%</td>
                    <td class='text-right'><strong>₹{item.TotalAmount:F2}</strong></td>
                </tr>");
                }
            }
            else
            {
                html.Append(@"
                <tr>
                    <td colspan='11' style='text-align: center; color: #666; font-style: italic;'>No items found</td>
                </tr>");
            }

            html.Append(@"
            </tbody>
        </table>");

            // Tax Summary
            if (invoiceData.TaxSummary != null)
            {
                html.Append($@"
        <div class='tax-summary'>
            <h3>Tax Summary</h3>
            <div class='tax-grid'>
                <div>
                    <div class='tax-item'><span>Total Taxable Value:</span><span>₹{invoiceData.TaxSummary.TotalTaxableValue:F2}</span></div>
                    <div class='tax-item'><span>CGST:</span><span>₹{invoiceData.TaxSummary.TotalCGST:F2}</span></div>
                    <div class='tax-item'><span>SGST:</span><span>₹{invoiceData.TaxSummary.TotalSGST:F2}</span></div>
                    <div class='tax-item'><span>IGST:</span><span>₹{invoiceData.TaxSummary.TotalIGST:F2}</span></div>
                </div>
                <div>
                    <div class='tax-item'><span>Total Discount:</span><span>₹{invoiceData.TaxSummary.TotalDiscount:F2}</span></div>
                    <div class='tax-item'><span>Shipping Charges:</span><span>₹{invoiceData.TaxSummary.ShippingCharges:F2}</span></div>
                    <div class='tax-item'><span>Total Tax:</span><span>₹{invoiceData.TaxSummary.TotalTax:F2}</span></div>
                </div>
            </div>
            <div class='total-amount'>
                <div style='display: flex; justify-content: space-between; align-items: center;'>
                    <span>Grand Total:</span>
                    <span class='amount'>₹{invoiceData.TaxSummary.GrandTotal:F2}</span>
                </div>
            </div>
        </div>");
            }

            // Payment Information
            if (invoiceData.Payment != null)
            {
                html.Append($@"
        <div class='tax-summary'>
            <h3>Payment Information</h3>
            <div class='tax-item'><span>Payment Method:</span><span>{invoiceData.Payment.Method ?? "N/A"}</span></div>
            <div class='tax-item'><span>Transaction ID:</span><span>{invoiceData.Payment.TransactionId ?? "N/A"}</span></div>
            <div class='tax-item'><span>Payment Date:</span><span>{invoiceData.Payment.PaymentDate ?? "N/A"}</span></div>
            <div class='tax-item'><span>Status:</span><span>{invoiceData.Payment.Status ?? "N/A"}</span></div>
            <div class='tax-item'><span>Amount Paid:</span><span>₹{invoiceData.Payment.AmountPaid:F2}</span></div>
        </div>");
            }

            // Terms and Conditions
            html.Append(@"
        <div class='terms'>
            <h4>Terms & Conditions:</h4>");

            if (invoiceData.Terms != null && invoiceData.Terms.Any())
            {
                html.Append("<ul>");
                foreach (var term in invoiceData.Terms)
                {
                    html.Append($"<li>{term}</li>");
                }
                html.Append("</ul>");
            }
            else
            {
                html.Append(@"
            <ul>
                <li>Payment is due within 30 days of invoice date</li>
                <li>Late payments may incur additional charges</li>
                <li>Goods once sold will not be taken back</li>
                <li>Subject to jurisdiction of courts only</li>
            </ul>");
            }

            html.Append("</div>");

            // E-Invoice info (if available)
            if (invoiceData.EInvoice != null && !string.IsNullOrEmpty(invoiceData.EInvoice.Irn))
            {
                html.Append($@"
        <div class='e-invoice-section'>
            <h3>E-Invoice Details</h3>
            <p><strong>IRN:</strong> {invoiceData.EInvoice.Irn}</p>
            <p><strong>Ack No:</strong> {invoiceData.EInvoice.AckNo} | <strong>Ack Date:</strong> {invoiceData.EInvoice.AckDate}</p>");
                
                if (!string.IsNullOrEmpty(invoiceData.EInvoice.QrCode))
                {
                    html.Append($@"<p><strong>QR Code:</strong> <img src='{invoiceData.EInvoice.QrCode}' alt='QR Code' style='width: 100px; height: 100px;' /></p>");
                }
                
                html.Append("</div>");
            }

            // Signature section
            html.Append(@"
        <div class='signature-section'>
            <div class='signature-box'>
                <div class='signature-line'>
                    <strong>Customer Signature</strong>
                </div>
            </div>
            <div class='signature-box'>
                <div class='signature-line'>
                    <strong>Authorized Signatory</strong>
                </div>
            </div>
        </div>");

            // Footer
            html.Append(@"
        <div class='footer'>
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
            <p>Thank you for your business!</p>
        </div>
    </div>
</body>
</html>");

            return html.ToString();
        }
    }
}
