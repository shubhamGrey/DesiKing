using Agronexis.DataAccess.DbContexts;
using Agronexis.Model.EntityModel;
using Agronexis.Model.RequestModel;
using Agronexis.Model.ResponseModel;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace Agronexis.DataAccess.ConfigurationsRepository
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly AppDbContext _dbContext;
        public ConfigurationRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public List<ProductResponseModel> GetProducts(string xCorrelationId)
        {
            List<ProductResponseModel> productList = _dbContext.Products.Where(x => x.IsActive).Select(x => new ProductResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                Currency = x.Currency,
                ManufacturingDate = x.ManufacturingDate,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).ToList();

            return productList;
        }

        public ProductResponseModel GetProductById(string id, string xCorrelationId)
        {
            ProductResponseModel product = _dbContext.Products.Where(x => x.Id == new Guid(id)).Select(x => new ProductResponseModel
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                Currency = x.Currency,
                ManufacturingDate = x.ManufacturingDate,
                IsActive = x.IsActive,
                IsDeleted = x.IsDeleted,
                MetaTitle = x.MetaTitle,
                MetaDescription = x.MetaDescription
            }).FirstOrDefault();

            return product;
        }

        public string SaveOrUpdateProduct(ProductRequestModel productReq, string xCorrelationId)
        {
            var productDetail = _dbContext.Products.FirstOrDefault(x => x.Id == productReq.Id);

            if (productDetail == null)
            {
                productDetail = new()
                {
                    Name = productReq.Name,
                    Description = productReq.Description,
                    Price = productReq.Price,
                    ManufacturingDate = productReq.ManufacturingDate,
                    ImageUrls = JsonSerializer.Serialize(productReq.ImageUrls),
                    KeyFeatures = JsonSerializer.Serialize(productReq.KeyFeatures),
                    Uses = JsonSerializer.Serialize(productReq.Uses),
                    CategoryId = new Guid(productReq.CategoryId),
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow,
                    Currency = productReq.Currency,
                    BrandId = productReq.BrandId,
                    MetaTitle = productReq.MetaTitle,
                    MetaDescription = productReq.MetaDescription
                };

                _dbContext.Products.Add(productDetail);
            }
            else if(productDetail != null && productDetail.Id == productReq.Id)
            {
                productDetail.Name = productReq.Name;
                productDetail.Description = productReq.Description;
                productDetail.Price = productReq.Price;
                productDetail.ManufacturingDate = productReq.ManufacturingDate;
                productDetail.ImageUrls = JsonSerializer.Serialize(productReq.ImageUrls);
                productDetail.KeyFeatures = JsonSerializer.Serialize(productDetail.KeyFeatures);
                productDetail.Uses = JsonSerializer.Serialize(productDetail.Uses);
                productDetail.ModifiedDate = DateTime.UtcNow;
                productDetail.IsActive = productReq.IsActive;
                productDetail.BrandId = productReq.BrandId;
                productDetail.MetaTitle = productReq.MetaTitle;
                productDetail.MetaDescription = productReq.MetaDescription;

                _dbContext.Products.Update(productDetail);
            }
            _dbContext.SaveChanges();
            return productDetail.Id.ToString();
        }

        public string DeleteProductById(string id, string xCorrelationId)
        {
            var productDetail = _dbContext.Products.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

            if (productDetail != null)
            {
                productDetail.IsActive = false;
                productDetail.IsDeleted = true;
                _dbContext.Products.Update(productDetail);
                _dbContext.SaveChanges();
                return "Record deleted successfully.";
            }
            else
            {
                return null;
            }
        }

        public List<CategoryResponseModel> GetCategories(string xCorrelationId)
        {
            List<CategoryResponseModel> categoryList = _dbContext.Categories.Where(x => x.IsActive).Select(x => new CategoryResponseModel
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
                    IsActive = true,
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
            var categoryDetail = _dbContext.Categories.FirstOrDefault(x => x.Id == new Guid(id) && x.IsActive);

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
                    IsActive = true,
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
    }
}
