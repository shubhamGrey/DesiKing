using Agronexis.DataAccess.DbContexts;
using Agronexis.ExternalApi;
using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.X509;
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
        public ConfigurationRepository(AppDbContext dbContext, IConfiguration configuration, ExternalUtility externalUtility)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _externalUtility = externalUtility;
        }
        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            var productList = (
                                from P in _dbContext.Products
                                    .Include(p => p.ProductPrices)
                                    .ThenInclude(pp => pp.Weight)
                                join C in _dbContext.Categories
                                    on P.CategoryId equals C.Id
                                where P.IsActive && C.IsActive // Optional: if category has IsActive
                                select new { P, C }
                            )
                            .AsEnumerable()
                            .Select(x => new ProductResponseModel
                            {
                                Id = x.P.Id,
                                Name = x.P.Name,
                                Description = x.P.Description,
                                ManufacturingDate = x.P.ManufacturingDate,
                                ImageUrls = JsonSerializer.Deserialize<List<string>>(x.P.ImageUrls),
                                KeyFeatures = JsonSerializer.Deserialize<List<string>>(x.P.KeyFeatures),
                                Uses = JsonSerializer.Deserialize<List<string>>(x.P.Uses),
                                CategoryId = x.P.CategoryId,
                                CategoryName = x.C.Name,
                                BrandId = x.P.BrandId,
                                MetaTitle = x.P.MetaTitle,
                                MetaDescription = x.P.MetaDescription,
                                CreatedDate = DateTime.UtcNow,
                                Origin = x.P.Origin,
                                ShelfLife = x.P.ShelfLife,
                                StorageInstructions = x.P.StorageInstructions,
                                Certifications = JsonSerializer.Deserialize<List<string>>(x.P.Certifications),
                                IsActive = x.P.IsActive,
                                IsPremium = x.P.IsPremium,
                                IsFeatured = x.P.IsFeatured,
                                Ingredients = x.P.Ingredients,
                                NutritionalInfo = x.P.NutritionalInfo,
                                ThumbnailUrl = x.P.ThumbnailUrl,

                                PricesAndSkus = x.P.ProductPrices.Select(pp => new PriceResponseModel
                                {
                                    Id = pp.Id,
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

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            Guid productId = Guid.Parse(id);

            var result = (
                from P in _dbContext.Products
                    .Include(p => p.ProductPrices)
                    .ThenInclude(pp => pp.Weight)
                join C in _dbContext.Categories on P.CategoryId equals C.Id
                where P.Id == productId
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
            })
            .FirstOrDefault();

            return result;
        }


        public List<ProductResponseModel> GetProductsByCategory(string categoryId, string xCorrelationId)
        {
            Guid catId = Guid.Parse(categoryId);

            var productList = (
                from P in _dbContext.Products
                    .Include(p => p.ProductPrices)
                    .ThenInclude(pp => pp.Weight)
                join C in _dbContext.Categories on P.CategoryId equals C.Id
                where P.IsActive && P.CategoryId == catId
                select new { P, C }
            )
            .AsEnumerable() // Ensure everything after this is in-memory
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


        public string SaveOrUpdateProduct(ProductRequestModel productReq, string xCorrelationId)
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
            else
            {
                // Handle Price Updates
                if (productReq.PricesAndSkus != null)
                {
                    // Remove prices not in request
                    var incomingPriceIds = productReq.PricesAndSkus.Select(p => p.Id).Where(id => id != Guid.Empty).ToList();
                    var pricesToRemove = productDetail.ProductPrices
                        .Where(p => !incomingPriceIds.Contains(p.Id))
                        .ToList();
                    _dbContext.ProductPrices.RemoveRange(pricesToRemove);

                    foreach (var price in productReq.PricesAndSkus)
                    {
                        var existingPrice = productDetail.ProductPrices.FirstOrDefault(p => p.Id == price.Id && price.Id != Guid.Empty);
                        if (existingPrice != null)
                        {
                            existingPrice.Price = price.Price;
                            existingPrice.CurrencyId = price.CurrencyId;
                            existingPrice.IsDiscounted = price.IsDiscounted;
                            existingPrice.DiscountPercentage = price.DiscountPercentage;
                            existingPrice.DiscountedAmount = price.DiscountedAmount;
                            existingPrice.SkuNumber = price.SkuNumber;
                            existingPrice.WeightId = price.WeightId;
                            existingPrice.Barcode = price.Barcode;
                            existingPrice.IsActive = price.IsActive;
                            existingPrice.IsDeleted = price.IsDeleted;
                            existingPrice.ModifiedDate = DateTime.UtcNow;
                        }
                        else
                        {
                            _dbContext.ProductPrices.Add(new ProductPrice
                            {
                                Id = Guid.NewGuid(),
                                ProductId = productDetail.Id,
                                Price = price.Price,
                                CreatedDate = DateTime.UtcNow,
                                CurrencyId = price.CurrencyId,
                                IsDiscounted = price.IsDiscounted,
                                DiscountPercentage = price.DiscountPercentage,
                                DiscountedAmount = price.DiscountedAmount,
                                SkuNumber = price.SkuNumber,
                                WeightId = price.WeightId,
                                Barcode = price.Barcode,
                                IsActive = price.IsActive,
                                IsDeleted = price.IsDeleted
                            });
                        }
                    }
                }
            }

            _dbContext.SaveChanges();
            return productDetail.Id.ToString();
        }



        public string DeleteProductById(string id, string xCorrelationId)
        {
            Guid productId = Guid.Parse(id);

            var productDetail = _dbContext.Products
                .Include(p => p.ProductPrices)
                .FirstOrDefault(x => x.Id == productId && x.IsActive);

            if (productDetail != null)
            {
                // Soft-delete product
                productDetail.IsActive = false;
                productDetail.IsDeleted = true;
                productDetail.ModifiedDate = DateTime.UtcNow;

                // Soft-delete product prices
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


        public List<CategoryResponseModel> GetCategories(string xCorrelationId)
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

        public CategoryResponseModel GetCategoryById(string id, string xCorrelationId)
        {
            CategoryResponseModel category = _dbContext.Categories.Where(x => x.Id == new Guid(id)).Select(x => new CategoryResponseModel
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

        public string SaveOrUpdateCategory(CategoryRequestModel category, string xCorrelationId)
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
            else if (categoryDetail != null && categoryDetail.Id == category.Id)
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

        public string DeleteCategoryById(string id, string xCorrelationId)
        {
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == new Guid(id));

            if (categoryDetail != null)
            {
                categoryDetail.IsActive = false;
                categoryDetail.IsDeleted = true;
                _dbContext.Categories.Update(categoryDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<BrandResponseModel> GetBrands(string xCorrelationId)
        {
            List<BrandResponseModel> brandList = _dbContext.Brands.Where(x => x.IsActive).Select(x => new BrandResponseModel
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

        public BrandResponseModel GetBrandById(string id, string xCorrelationId)
        {
            BrandResponseModel brandDetail = _dbContext.Brands.Where(x => x.Id == new Guid(id)).Select(x => new BrandResponseModel
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

        public string SaveOrUpdateBrand(BrandRequestModel brandReq, string xCorrelationId)
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
            else if (brandDetail != null && brandDetail.Id == brandReq.Id)
            {
                brandDetail.Name = brandReq.Name;
                brandDetail.Code = brandReq.Code;
                brandDetail.Description = brandReq.Description;
                brandDetail.LogoURL = brandReq.LogoUrl;
                brandDetail.ModifiedDate = DateTime.UtcNow;
                brandDetail.IsActive = brandReq.IsActive;
                brandDetail.MetaTitle = brandReq.MetaTitle;
                brandDetail.Description = brandReq.Description;

                _dbContext.Brands.Update(brandDetail);
            }
            _dbContext.SaveChanges();
            return brandDetail.Id.ToString();
        }

        public string DeleteBrandById(string id, string xCorrelationId)
        {
            var brandDetail = _dbContext.Brands.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (brandDetail != null)
            {
                brandDetail.IsActive = false;
                brandDetail.IsDeleted = true;
                _dbContext.Brands.Update(brandDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<RoleResponseModel> GetRoles(string xCorrelationId)
        {
            List<RoleResponseModel> roleList = _dbContext.Roles.Where(x => x.IsActive).Select(x => new RoleResponseModel
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

        public RoleResponseModel GetRoleById(string id, string xCorrelationId)
        {
            RoleResponseModel roleDetail = _dbContext.Roles.Where(x => x.Id == new Guid(id)).Select(x => new RoleResponseModel
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

        public string SaveOrUpdateRole(RoleRequestModel roleRequest, string xCorrelationId)
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
            else if (roleDetail != null && roleDetail.Id == roleRequest.Id)
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

        public string DeleteRoleById(string id, string xCorrelationId)
        {
            var roleDetail = _dbContext.Roles.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (roleDetail != null)
            {
                roleDetail.IsActive = false;
                roleDetail.IsDeleted = true;
                _dbContext.Roles.Update(roleDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public async Task<LoginResponseModel> UserLogin(LoginRequestModel model, string xCorrelationId)
        {
            var user = await Authenticate(model.Email, model.UserName, model.Password);
            if (user != null)
            {
                return GenerateJwtToken(user);
            }

            return new LoginResponseModel();
        }

        public async Task<RegistrationResponseModel> UserRegistration(RegistrationRequestModel model, string xCorrelationId)
        {
            RegistrationResponseModel signupResponse = new();
            var userExists = await Authenticate(model.Email, model.UserName, model.Password);
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
                    RoleId = model.RoleId
                };

                _dbContext.Users.Add(user);
                _dbContext.SaveChanges();

                signupResponse.RegisteredId = userExists?.Id.ToString();
                signupResponse.Message = "User registered successfully";
            }
            else if (userExists != null)
            {
                signupResponse.RegisteredId = userExists?.Id.ToString();
                signupResponse.Message = "User already exists";
            }

            return signupResponse;
        }

        private async Task<User> Authenticate(string email, string username, string password)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => (u.Email == email || u.UserName == username) && u.IsActive);
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
            LoginResponseModel loginResponse = new()
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
                RefreshToken = new JwtSecurityTokenHandler().WriteToken(refreshToken)
            };

            return loginResponse;
        }

        public async Task<OrderResponseModel> CreateOrder(OrderRequestModel orderRequest, string xCorrelationId)
        {
            try
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
                    //ReceiptId = orderRequest.ReceiptId,
                    TotalAmount = orderRequest.TotalAmount,
                    Currency = orderRequest.Currency,
                    Status = orderRequest.Status,
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

                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();

                OrderResponseModel orderResponse = new()
                {
                    OrderId = order.Id,
                    RazorpayOrderId = razorpayOrderId
                };
                return orderResponse;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool VerifyPayment(VerifyPaymentRequestModel verify, string xCorrelationId)
        {
            bool isVerify = _externalUtility.RazorPayVerifyPayment(verify.OrderId, verify.PaymentId, verify.Signature);
            if (isVerify)
            {
                //insert into transaction table
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
                _dbContext.Transactions.Add(transaction);
                _dbContext.SaveChangesAsync();
            }
            return isVerify;
        }

        public async Task<UserProfileResponseModel> GetUserProfile(Guid userId, string xCorrelationId)
        {
            try
            {
                var user = await _dbContext.Users
                    .Include(u => u.Roles)
                    .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive && !u.IsDeleted);

                if (user == null)
                {
                    return null;
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserProfile: {ex.Message}");
                throw;
            }
        }

        public RefundPaymentResponseModel RefundPayment(RefundPaymentRequestModel refund, string xCorrelationId)
        {
            RefundPaymentResponseModel refundPaymentResponse = _externalUtility.RazorPayRefundPayment(refund.PaymentId, refund.AmountInPaise);
            //insert into transaction table
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = refund.UserId,
                RazorpayOrderId = refund.OrderId,
                RazorpayPaymentId = refund.PaymentId,
                Signature = refund.Signature,
                TotalAmount = (refund.AmountInPaise / 100),
                Currency = refund.Currency,
                Status = "Paid",
                PaymentMethod = refund.PaymentMethod,
                CreatedDate = DateTime.UtcNow
            };
            _dbContext.Transactions.Add(transaction);
            _dbContext.SaveChangesAsync();

            return refundPaymentResponse;
        }

        public List<CartResponseModel> GetCartItemsByUserId(string id, string xCorrelationId)
        {
            List<CartResponseModel> cartItemList = _dbContext.Carts.Where(x => x.UserId == new Guid(id)).Select(x => new CartResponseModel
            {
                Id = x.Id,
                UserId = x.UserId,
                ProductId = x.ProductId,
                BrandId = x.BrandId,
                Quantity = x.Quantity,
                CreatedDate = x.CreatedDate,
                ModifiedDate = x.ModifiedDate
            }).ToList();

            return cartItemList;
        }

        public string DeleteCartById(string id, string xCorrelationId)
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

        public string SaveOrUpdateCart(CartRequestModel cartRequest, string xCorrelationId)
        {
            var cartDetail = _dbContext.Carts.FirstOrDefault(x => x.Id == cartRequest.Id);

            if (cartDetail == null)
            {
                cartDetail = new()
                {
                    UserId = cartRequest.UserId,
                    ProductId = cartRequest.ProductId,
                    Quantity = cartRequest.Quantity,
                    BrandId = cartRequest.BrandId,
                    CreatedDate = DateTime.UtcNow
                };

                _dbContext.Carts.Add(cartDetail);
            }
            else if (cartDetail != null && cartDetail.Id == cartRequest.Id)
            {
                cartDetail.Quantity = cartRequest.Quantity;
                cartDetail.ModifiedDate = DateTime.UtcNow;

                _dbContext.Carts.Update(cartDetail);
            }
            _dbContext.SaveChanges();
            return cartDetail.Id.ToString();
        }

        public List<CurrencyResponseModel> GetCurrencies(string xCorrelationId)
        {
            try
            {
                List<CurrencyResponseModel> CurrencyList = _dbContext.Currencies.Where(x => x.IsActive).Select(x => new CurrencyResponseModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    IsDefault = x.IsDefault,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted,
                    CreatedDate = x.CreatedDate,
                    ModifiedDate = x.ModifiedDate
                }).ToList();

                return CurrencyList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<WeightResponseModel> GetWeights(string xCorrelationId)
        {
            try
            {
                List<WeightResponseModel> weightList = _dbContext.Weights.Select(x => new WeightResponseModel
                {
                    Id = x.Id,
                    Value = x.Value,
                    Unit = x.Unit
                }).ToList();

                return weightList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
